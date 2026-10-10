import React from 'react'
import {vi} from 'vitest'
import {render, unmountComponentAtNode} from 'react-dom'
import {Simulate} from 'react-dom/test-utils'
import {Provider} from 'react-redux'
import {MemoryRouter} from 'react-router-dom'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import App from './App'
import {reducer} from '../store/reducer'
import {fetchQuotes, checkUser} from '../store/actions'
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
})

afterEach(() => {
  unmountComponentAtNode(container)
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
  Simulate.click(container.querySelector('[data-index="0"]'))
  store.dispatch(fetchQuotes())
  store.dispatch(checkUser())
  await new Promise(resolve => setTimeout(resolve, 0))

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
    await new Promise(resolve => setTimeout(resolve, 0))

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
  await new Promise(resolve => setTimeout(resolve, 0))

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
  await new Promise(resolve => setTimeout(resolve, 0))

  const author = container.querySelector('a[href="/author/Alan_Kay"]')
  expect(author.querySelector('img').getAttribute('src')).toBe('https://example.com/alan-kay.jpg')
  expect(store.getState().allQuotes).toBe(cachedQuotes)
  expect(store.getState().isFetching).toBe(false)
  expect(store.getState().error).toContain('404')
})
