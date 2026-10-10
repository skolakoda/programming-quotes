import {vi} from 'vitest'
import {MemoryRouter, useNavigate} from 'react-router'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import {thunk} from 'redux-thunk'
import {act, render, unmount, flushRequests} from '../test/render'
import Router from './Router'
import {reducer} from '../store/reducer'
import {API, domain} from '../config/api'
import {LS} from '../config/localstorage'

const dataMode = vi.hoisted(() => ({useServerData: false}))
vi.mock('../config/api', async importOriginal => ({
  ...await importOriginal(),
  get useServerData() { return dataMode.useServerData }
}))

const quotes = [
  {_id: 'first', author: 'Alan Kay', en: 'First quote', sr: 'Prvi citat', rating: 3},
  {_id: 'second', author: 'Gérard Berry', en: 'Second quote', sr: 'Drugi citat', rating: 4}
]
let container, navigate
function NavigationProbe() {
  navigate = useNavigate()
  return null
}
function mount(path, overrides = {}) {
  const store = createStore(reducer, {
    ...reducer(undefined, {}), allQuotes: quotes, token: '', admin: false, ...overrides
  }, applyMiddleware(thunk))
  render(<Provider store={store}><MemoryRouter initialEntries={[path]}>
    <NavigationProbe /><Router />
  </MemoryRouter></Provider>, container)
  return store
}
function go(path) {
  act(() => navigate(path))
}
beforeEach(() => {
  container = document.createElement('div')
  document.body.append(container)
  dataMode.useServerData = false
  localStorage.clear()
  vi.stubGlobal('fetch', vi.fn(async () => ({
    ok: true, json: async () => ({query: {pages: {1: {title: 'Author', extract: ''}}}})
  })))
})
afterEach(async () => {
  await flushRequests()
  unmount(container)
  container.remove()
  vi.unstubAllGlobals()
  localStorage.clear()
})

test.each(['/', '/all-quotes'])('public quote lists keep their existing address: %s', path => {
  mount(path)
  expect(container.querySelector('.quote-text')).not.toBeNull()
})

test('quote and author links navigate, including encoded author names and changed parameters', () => {
  mount('/quote/first')
  expect(container.querySelector('.quote-text').textContent).toContain('First quote')
  act(() => container.querySelector('a[href="/author/Alan_Kay"]').click())
  expect(container.querySelector('h1').textContent).toBe('Alan Kay')
  go('/author/G%C3%A9rard_Berry')
  expect(container.querySelector('h1').textContent).toBe('Gérard Berry')
  expect(container.querySelector('.quote-text').textContent).toContain('Second quote')
  act(() => container.querySelector('a[href="/quote/second"]').click())
  expect(container.querySelector('.big-quote .quote-text').textContent).toContain('Second quote')
  go('/quote/first')
  expect(container.querySelector('.big-quote .quote-text').textContent).toContain('First quote')
})

test('changing routes does not fetch from the backend in local mode', async () => {
  mount('/all-quotes')
  go('/author/Alan_Kay')
  go('/quote/second')
  go('/')
  await flushRequests()
  fetch.mock.calls.forEach(([url]) => expect(new URL(url).hostname).toBe('en.wikipedia.org'))
})

test('server login and profile keep their existing addresses', () => {
  dataMode.useServerData = true
  mount('/login')
  expect(container.querySelector('h1').textContent).toBe('Login')
  go('/profile')
  expect(container.querySelector('h1').textContent).toBe('My profile')
})

test('server edit forms reload the correct fields when the quote id changes or a new quote is added', () => {
  dataMode.useServerData = true
  mount('/edit-quote/first', {admin: true})
  expect(container.querySelector('textarea[name="en"]').value).toBe('First quote')
  go('/edit-quote/second')
  expect(container.querySelector('input[name="_id"]').value).toBe('second')
  expect(container.querySelector('input[name="author"]').value).toBe('Gérard Berry')
  expect(container.querySelector('textarea[name="en"]').value).toBe('Second quote')
  expect(container.querySelector('h1').textContent).toContain('Edit quote')
  go('/add-quote')
  expect(container.querySelector('h1').textContent).toBe('Add quote')
  expect(container.querySelector('input[name="_id"]').value).toBe('')
  expect(container.querySelector('textarea[name="en"]').value).toBe('')
})

test('editing submits the id from the current address', async () => {
  dataMode.useServerData = true
  fetch.mockResolvedValue({ok: true, json: async () => ({message: 'SUCCESS_SAVED', quote: quotes[1]})})
  mount('/edit-quote/first', {admin: true, token: 'saved-token'})
  go('/edit-quote/second')
  act(() => container.querySelector('form').dispatchEvent(new Event('submit', {bubbles: true, cancelable: true})))
  await flushRequests()
  expect(fetch.mock.calls[0][0]).toBe(API.update)
  expect(JSON.parse(fetch.mock.calls[0][1].body)).toMatchObject({_id: 'second', en: 'Second quote', token: 'saved-token'})
})

test('server editing continues to require an administrator', () => {
  dataMode.useServerData = true
  mount('/edit-quote/first')
  expect(container.querySelector('form')).toBeNull()
  expect(container.textContent).toContain('You must have admin privilege.')
})

test('authentication stores and checks the token from the address, including a later callback', async () => {
  dataMode.useServerData = true
  fetch.mockResolvedValue({ok: true, json: async () => ({user: {admin: true}})})
  const store = mount('/auth/github/first-token')
  await flushRequests()
  expect(localStorage.getItem(LS.token)).toBe('first-token')
  expect(fetch).toHaveBeenCalledWith(`${domain}/auth/github/first-token`)
  expect(store.getState().token).toBe('first-token')
  expect(store.getState().admin).toBe(true)
  go('/auth/google/second-token')
  await flushRequests()
  expect(localStorage.getItem(LS.service)).toBe('google')
  expect(fetch).toHaveBeenCalledWith(`${domain}/auth/google/second-token`)
  expect(store.getState().token).toBe('second-token')
})

test('unknown addresses keep the navigation area empty', () => {
  mount('/unknown')
  expect(container.textContent).toBe('')
})
