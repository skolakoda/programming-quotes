import React from 'react'
import {vi} from 'vitest'
import {act, render, unmount, flushRequests} from '../test/render'
import {Provider} from 'react-redux'
import {MemoryRouter} from 'react-router'
import {createStore, applyMiddleware} from 'redux'
import {thunk} from 'redux-thunk'
import App from './App'
import {reducer} from '../store/reducer'
import {setPhrase, setAllAuthors, setLanguage} from '../store/actions'
import {store as applicationStore} from '../store'
import {LS} from '../config/localstorage'

const originalFetch = global.fetch
let container

beforeEach(() => {
  container = document.createElement('div')
  document.body.append(container)
})

afterEach(() => {
  unmount(container)
  container.remove()
  global.fetch = originalFetch
  localStorage.clear()
  document.documentElement.lang = 'en'
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

test('staroslavonic selection shows translated quotes and supports switching back to English', async () => {
  global.fetch = vi.fn(() => Promise.resolve(wikipediaResponse()))
  mountApp(applicationStore)
  const translated = applicationStore.getState().allQuotes.filter(quote => quote.stsl)
  const languageButton = container.querySelector('button[lang="cu"]')

  try {
    act(() => languageButton.click())
    expect(languageButton.getAttribute('aria-pressed')).toBe('true')
    expect(container.querySelector('h1').textContent).toBe('Programerski citati')
    expect([...container.querySelectorAll('.quote-text a')].map(link => link.textContent))
      .toEqual(translated.slice(0, 10).map(quote => quote.stsl))

    act(() => container.querySelector('nav a[href="/"]').click())
    expect(translated.some(quote => container.querySelector('.quote-text').textContent.includes(quote.stsl))).toBe(true)
    act(() => container.querySelector('button[lang="en"]').click())
    expect(languageButton.getAttribute('aria-pressed')).toBe('false')
    expect(applicationStore.getState().allQuotes.some(quote => container.querySelector('.quote-text').textContent.includes(quote.en))).toBe(true)
    await flushRequests()
  } finally {
    act(() => applicationStore.dispatch(setLanguage('en')))
  }
})

test('the selected language is saved and marks the interface and quote languages', () => {
  global.fetch = vi.fn(() => Promise.resolve(wikipediaResponse()))
  const store = createStore(reducer, applyMiddleware(thunk))
  mountApp(store)
  act(() => container.querySelector('button[lang="cu"]').click())
  expect(localStorage.getItem(LS.language)).toBe('stsl')
  expect(document.documentElement.lang).toBe('sr')
  expect(container.querySelector('.quote-text').getAttribute('lang')).toBe('cu')
  act(() => container.querySelector('button[lang="sr"]').click())
  expect(container.querySelector('button[lang="sr"]').getAttribute('aria-pressed')).toBe('true')
  expect(localStorage.getItem(LS.language)).toBe('sr')
  expect(container.querySelector('.quote-text').getAttribute('lang')).toBe('sr')
})

test('renders local quotes immediately, requests only Wikipedia, and keeps ratings in the browser', async () => {
  const store = createStore(reducer, applyMiddleware(thunk))
  const localQuotes = store.getState().allQuotes
  global.fetch = vi.fn(() => Promise.resolve(wikipediaResponse()))

  mountApp(store)

  expect(container.querySelector('.quote-text').textContent).toContain(localQuotes[0].en)
  act(() => container.querySelector('.rating input[value="4.5"]').click())
  expect(JSON.parse(localStorage.getItem(LS.localRatings))).toEqual({[localQuotes[0]._id]: 4.5})
  await flushRequests()

  expect(store.getState().allQuotes).toBe(localQuotes)
  expect(global.fetch.mock.calls.length).toBeGreaterThan(0)
  global.fetch.mock.calls.forEach(([url]) => {
    expect(new URL(url).hostname).toBe('en.wikipedia.org')
  })
  const author = container.querySelector('a[href="/author/Alan_Kay"]')
  expect(author.querySelector('img').getAttribute('src')).toBe('https://example.com/alan-kay.jpg')
  unmount(container)
  mountApp(createStore(reducer, applyMiddleware(thunk)))
  await flushRequests()
  expect(container.querySelector('.rating input[value="4.5"]').checked).toBe(true)
  global.fetch.mock.calls.forEach(([url]) => {
    expect(new URL(url).hostname).toBe('en.wikipedia.org')
  })
})

test('pagination marks the current page, returns to the top of the list, and resets when the filter changes', async () => {
  const store = createStore(reducer, reducer(undefined, {}), applyMiddleware(thunk))
  global.fetch = vi.fn(() => Promise.resolve(wikipediaResponse()))
  mountApp(store)
  expect(container.querySelector('button[aria-current="page"]').value).toBe('0')
  const list = container.querySelector('.pagination').parentElement
  list.scrollIntoView = vi.fn()
  vi.spyOn(list, 'getBoundingClientRect').mockReturnValue({top: -500})
  act(() => container.querySelector('button[value="1"]').click())
  expect(container.querySelector('button[aria-current="page"]').value).toBe('1')
  expect(list.scrollIntoView).toHaveBeenCalledTimes(1)
  expect(container.querySelector('.quote-text').textContent).toContain(store.getState().allQuotes[10].en)
  act(() => store.dispatch(setPhrase('Simplicity is prerequisite')))
  expect(container.querySelectorAll('.quote-text')).toHaveLength(1)
  expect(container.querySelector('.quote-text').textContent).toContain('Simplicity is prerequisite')
  await flushRequests()
})

test.each(['/', '/statistics', '/quote/5a6ce86e2af929789500e7e4'])(
  'searching quotes from %s opens the filtered list of all quotes', async path => {
    const store = createStore(reducer, applyMiddleware(thunk))
    global.fetch = vi.fn(() => Promise.resolve(wikipediaResponse()))
    mountApp(store, path)
    const input = container.querySelectorAll('.filters input')[0]
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, 'Simplicity is prerequisite')
      input.dispatchEvent(new Event('input', {bubbles: true}))
    })
    expect(container.querySelector('h1').textContent).toBe('Programming quotes')
    expect(container.querySelectorAll('.quote-text')).toHaveLength(1)
    expect(container.querySelector('.filters input').value).toBe('Simplicity is prerequisite')
    await flushRequests()
  }
)

test('searching quotes on an author page keeps filtering that author', async () => {
  const store = createStore(reducer, applyMiddleware(thunk))
  global.fetch = vi.fn(() => Promise.resolve(wikipediaResponse()))
  mountApp(store, '/author/Edsger_W._Dijkstra')
  const input = container.querySelectorAll('.filters input')[0]
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, 'telescopes')
    input.dispatchEvent(new Event('input', {bubbles: true}))
  })
  expect(container.querySelector('h1').textContent).toBe('Edsger W. Dijkstra')
  expect(container.querySelectorAll('.quote-text')).toHaveLength(1)
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
  expect(container.querySelector('a.author img').getAttribute('alt')).toBe('')
  expect(input.labels[0].textContent).toBe('Search authors')
  expect(container.querySelectorAll('.filters input')[0].labels[0].textContent).toBe('Search quotes')
  act(() => store.dispatch(setAllAuthors(new Set(['Alan Kay', 'Grace Hopper']))))
  expect(container.querySelectorAll('a.author')).toHaveLength(2)
  expect(container.querySelector('.sidebar').textContent).toContain('Grace Hopper')
  await flushRequests()
})
