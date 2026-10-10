import React from 'react'
import {vi} from 'vitest'
import {act, render, unmount, flushRequests} from '../test/render'
import {Provider} from 'react-redux'
import {MemoryRouter} from 'react-router'
import {createStore, applyMiddleware} from 'redux'
import {thunk} from 'redux-thunk'
import App from './App'
import {reducer} from '../store/reducer'
import {fetchQuotes, checkUser, setPhrase, setAllAuthors} from '../store/actions'
import {API, domain} from '../config/api'

const dataMode = vi.hoisted(() => ({useServerData: false}))

vi.mock('../config/api', async importOriginal => ({
  ...await importOriginal(),
  get useServerData() { return dataMode.useServerData }
}))

const originalFetch = global.fetch
let container

beforeEach(() => {
  dataMode.useServerData = false
  container = document.createElement('div')
  document.body.append(container)
})

afterEach(() => {
  unmount(container)
  container.remove()
  global.fetch = originalFetch
  localStorage.clear()
})

function mountApp(store, path = '/all-quotes') {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}><App /></MemoryRouter>
    </Provider>, container
  )
}

function wikipediaResponse() {
  return {ok: true, json: () => Promise.resolve({query: {pages: {
    1: {title: 'Alan Kay', thumbnail: {source: 'https://example.com/alan-kay.jpg'}}
  }}})}
}

test('local mode renders quotes immediately without backend requests, even with a saved account', async () => {
  const store = createStore(reducer, {
    ...reducer(undefined, {}), token: 'saved-token', admin: true
  }, applyMiddleware(thunk))
  const localQuotes = store.getState().allQuotes
  global.fetch = vi.fn(() => Promise.resolve(wikipediaResponse()))

  mountApp(store)

  expect(container.querySelector('.quote-text').textContent).toContain(localQuotes[0].en)
  expect(container.querySelector('a[href="/profile"]')).toBeNull()
  expect(container.querySelector('a[href="/login"]')).toBeNull()
  expect(container.querySelector('a[href="/add-quote"]')).toBeNull()
  expect(container.querySelector('.admin-actions')).toBeNull()
  act(() => container.querySelector('.rating').click())
  act(() => store.dispatch(fetchQuotes()))
  act(() => store.dispatch(checkUser()))
  await flushRequests()

  expect(store.getState().allQuotes).toBe(localQuotes)
  expect(global.fetch.mock.calls.length).toBeGreaterThan(0)
  global.fetch.mock.calls.forEach(([url]) => {
    expect(new URL(url).hostname).toBe('en.wikipedia.org')
  })
  const author = container.querySelector('a[href="/author/Alan_Kay"]')
  expect(author.querySelector('img').getAttribute('src')).toBe('https://example.com/alan-kay.jpg')
})

test.each(['/profile', '/login', '/add-quote', '/edit-quote/1', '/auth/github/token'])(
  'local mode blocks backend routes: %s', async path => {
    const store = createStore(reducer, {
      ...reducer(undefined, {}), token: 'saved-token', admin: true
    }, applyMiddleware(thunk))
    localStorage.setItem('programmingQuotesToken', 'saved-token')
    global.fetch = vi.fn(() => Promise.resolve(wikipediaResponse()))

    mountApp(store, path)
    await flushRequests()

    global.fetch.mock.calls.forEach(([url]) => {
      expect(new URL(url).hostname).toBe('en.wikipedia.org')
    })
    expect(container.querySelector('form')).toBeNull()
  }
)

test('server mode loads server quotes and preserves account and editing options', async () => {
  dataMode.useServerData = true
  const store = createStore(reducer, {
    ...reducer(undefined, {}), token: 'saved-token', admin: false
  }, applyMiddleware(thunk))
  localStorage.setItem('programmingQuotesAuthService', 'github')
  const serverQuotes = [{_id: 'server-quote', en: 'Quote from the server', author: 'Alan Kay', rating: 4}]
  global.fetch = vi.fn(url => {
    if (url.includes('prop=pageimages')) return Promise.resolve(wikipediaResponse())
    return Promise.resolve({ok: true, json: () => Promise.resolve(
      url === API.read ? serverQuotes : {user: {admin: true}}
    )})
  })

  mountApp(store)
  await flushRequests()

  expect(store.getState().allQuotes).toEqual(serverQuotes)
  expect(container.querySelector('.quote-text').textContent).toContain(serverQuotes[0].en)
  expect(global.fetch).toHaveBeenCalledWith(API.read)
  expect(global.fetch).toHaveBeenCalledWith(`${domain}/auth/github/saved-token`)
  expect(container.querySelector('a[href="/profile"]')).not.toBeNull()
  expect(container.querySelector('a[href="/add-quote"]')).not.toBeNull()
  expect(container.querySelector('.admin-actions')).not.toBeNull()
})

test('server mode retains local quotes and portraits when the quotes server is unavailable', async () => {
  dataMode.useServerData = true
  const store = createStore(reducer, {
    ...reducer(undefined, {}), token: '', admin: false
  }, applyMiddleware(thunk))
  const cachedQuotes = store.getState().allQuotes
  global.fetch = vi.fn(url => Promise.resolve(url.includes('prop=pageimages')
    ? wikipediaResponse()
    : {ok: false, status: 404}))

  mountApp(store)
  await flushRequests()

  const author = container.querySelector('a[href="/author/Alan_Kay"]')
  expect(author.querySelector('img').getAttribute('src')).toBe('https://example.com/alan-kay.jpg')
  expect(store.getState().allQuotes).toBe(cachedQuotes)
  expect(store.getState().isFetching).toBe(false)
  expect(store.getState().error).toContain('404')
})

test('pagination resets when the quote filter changes', async () => {
  const store = createStore(reducer, reducer(undefined, {}), applyMiddleware(thunk))
  global.fetch = vi.fn(() => Promise.resolve(wikipediaResponse()))
  mountApp(store)
  act(() => container.querySelector('button[value="1"]').click())
  expect(container.querySelector('.quote-text').textContent).toContain(store.getState().allQuotes[10].en)
  act(() => store.dispatch(setPhrase('Simplicity is prerequisite')))
  expect(container.querySelectorAll('.quote-text')).toHaveLength(1)
  expect(container.querySelector('.quote-text').textContent).toContain('Simplicity is prerequisite')
  await flushRequests()
})

test('author filtering and refreshing the author list keep the sidebar usable', async () => {
  const store = createStore(reducer, {
    ...reducer(undefined, {}), allAuthors: new Set(['Alan Kay', 'Alan Perlis'])
  }, applyMiddleware(thunk))
  global.fetch = vi.fn(() => Promise.resolve(wikipediaResponse()))
  mountApp(store)
  const input = container.querySelectorAll('.filters input')[1]
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, 'PERLIS')
    input.dispatchEvent(new Event('input', {bubbles: true}))
  })
  expect(container.querySelectorAll('a.author')).toHaveLength(1)
  expect(container.querySelector('a.author').textContent).toContain('Alan Perlis')
  act(() => store.dispatch(setAllAuthors(new Set(['Alan Kay', 'Grace Hopper']))))
  expect(container.querySelectorAll('a.author')).toHaveLength(2)
  expect(container.querySelector('.sidebar').textContent).toContain('Grace Hopper')
  await flushRequests()
})
