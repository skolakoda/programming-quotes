import {vi} from 'vitest'
import {MemoryRouter, useNavigate} from 'react-router'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import {thunk} from 'redux-thunk'
import {act, render, unmount, flushRequests} from '../test/render'
import Router from './Router'
import {reducer} from '../store/reducer'

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
    ...reducer(undefined, {}), allQuotes: quotes, ...overrides
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

test('author pages show the name without the Wikipedia disambiguation and keep it in the address', () => {
  const quote = {_id: 'third', author: 'Paul Graham (programmer)', en: 'Third quote', rating: 3}
  mount('/quote/third', {allQuotes: [quote]})
  const link = container.querySelector('.quote-author a')
  expect(link.textContent).toBe('Paul Graham')
  act(() => link.click())
  expect(container.querySelector('h1').textContent).toBe('Paul Graham')
  expect(container.querySelector('.quote-text').textContent).toContain('Third quote')
})

test('the statistics page is public', () => {
  mount('/statistics')
  expect(container.querySelector('h1').textContent).toBe('Statistics')
})

test('changing routes requests only Wikipedia', async () => {
  mount('/all-quotes')
  go('/author/Alan_Kay')
  go('/quote/second')
  go('/')
  await flushRequests()
  fetch.mock.calls.forEach(([url]) => expect(new URL(url).hostname).toBe('en.wikipedia.org'))
})

test.each(['/unknown', '/login', '/profile', '/add-quote', '/edit-quote/first', '/auth/github/token'])(
  'unknown and removed server addresses keep the navigation area empty: %s', path => {
    mount(path)
    expect(container.textContent).toBe('')
  }
)
