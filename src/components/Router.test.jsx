import {vi} from 'vitest'
import {MemoryRouter, useNavigate} from 'react-router'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import {thunk} from 'redux-thunk'
import {act, render, unmount, flushRequests} from '../test/render'
import Router from './Router'
import {reducer} from '../store/reducer'
import {setLanguage} from '../store/actions'

const quotes = [
  {_id: 'first', author: 'Alan Kay', en: 'First quote', sr: 'Prvi citat', rating: 3, tags: ['programming-humor']},
  {_id: 'second', author: 'Gérard Berry', en: 'Second quote', sr: '', rating: 4, tags: ['bugs', 'programming-humor']}
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

test('quotes link to their topics, and a topic page lists its quotes', () => {
  mount('/quote/second')
  const links = [...container.querySelectorAll('.quote-tags a')]
  expect(links.map(link => link.textContent)).toEqual(['bugs', 'programming-humor'])
  act(() => links[1].click())
  expect(container.querySelector('h1').textContent).toBe('Programming humor')
  expect(document.title).toBe('Programming humor | Programming quotes')
  expect(container.querySelectorAll('.quote-text')).toHaveLength(2)
  expect(container.querySelector('.quote-tags')).toBeNull()
  go('/tag/bugs')
  expect([...container.querySelectorAll('.quote-text')].map(quote => quote.textContent)).toEqual(['Second quote'])
})

test('the quote of the day shows its topics', () => {
  mount('/')
  expect(container.querySelector('.big-quote .quote-tags a[href="/tag/programming-humor"]')).not.toBeNull()
})

test('the topic cloud sizes topics by the quotes available in the selected language', () => {
  const store = mount('/tags')
  const items = () => [...container.querySelectorAll('.tag-cloud li')]
  expect(items().map(item => item.textContent)).toEqual(['bugs 1', 'programming-humor 2'])
  expect(items()[1].style.fontSize).toBe('2.2em')
  act(() => store.dispatch(setLanguage('sr')))
  expect(items().map(item => item.textContent)).toEqual(['programming-humor 1'])
})

test('the statistics page is public', () => {
  mount('/statistics')
  expect(container.querySelector('h1').textContent).toBe('Statistics')
})

test('each page names itself in the document title', () => {
  mount('/')
  expect(document.title).toBe('Quote of the day | Programming quotes')
  go('/all-quotes')
  expect(document.title).toBe('All quotes | Programming quotes')
  go('/statistics')
  expect(document.title).toBe('Statistics | Programming quotes')
  go('/author/G%C3%A9rard_Berry')
  expect(document.title).toBe('Gérard Berry | Programming quotes')
  go('/quote/first')
  expect(document.title).toBe('Alan Kay | Programming quotes')
})

test('changing routes requests only Wikipedia', async () => {
  mount('/all-quotes')
  go('/author/Alan_Kay')
  go('/quote/second')
  go('/')
  await flushRequests()
  fetch.mock.calls.forEach(([url]) => expect(new URL(url).hostname).toBe('en.wikipedia.org'))
})

test.each(['/unknown', '/login', '/quote/missing', '/author/Nobody', '/tag/unknown'])(
  'unknown addresses, quotes and authors show a not found page: %s', path => {
    mount(path)
    expect(container.querySelector('h1').textContent).toBe('Page not found')
    expect(document.title).toBe('Page not found | Programming quotes')
    expect(container.querySelector('a[href="/"]')).not.toBeNull()
  }
)
