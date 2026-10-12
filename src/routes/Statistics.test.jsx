import {Provider} from 'react-redux'
import {MemoryRouter} from 'react-router'
import {createStore} from 'redux'
import {render, unmount} from '../test/render'
import Statistics from './Statistics'
import {reducer} from '../store/reducer'

const quotes = [
  {_id: '1', author: 'Fred Brooks', en: 'One', sr: 'Jedan', stsl: 'Єдинъ'},
  {_id: '2', author: 'Alan Kay', en: 'Two', sr: ''},
  {_id: '3', author: 'Fred Brooks', en: 'Three', sr: 'Tri'},
  {_id: '4', author: 'Alan Perlis', en: 'Four', sr: 'Četiri'}
]
let container

beforeEach(() => {
  container = document.createElement('div')
})

afterEach(() => {
  unmount(container)
})

function mount(allQuotes = quotes) {
  const store = createStore(reducer, {...reducer(undefined, {}), allQuotes})
  render(<Provider store={store}><MemoryRouter><Statistics /></MemoryRouter></Provider>, container)
}
const texts = selector => [...container.querySelectorAll(selector)].map(element => element.textContent)

test('summarizes quotes, authors and translations', () => {
  mount()
  expect(texts('dd')).toEqual(['4', '3'])
  expect(texts('.meters .value')).toEqual(['4 / 4', '3 / 4', '1 / 4'])
  expect([...container.querySelectorAll('.meters .bar')].map(bar => bar.style.width))
    .toEqual(['100%', '75%', '25%'])
})

test('lists authors by number of quotes, then by name, with links to their pages', () => {
  mount()
  const rows = [...container.querySelectorAll('tbody tr')].map(row =>
    [...row.cells].slice(0, 2).map(cell => cell.textContent))
  expect(rows).toEqual([['Fred Brooks', '2'], ['Alan Kay', '1'], ['Alan Perlis', '1']])
  expect(container.querySelector('tbody a').getAttribute('href')).toBe('/author/Fred_Brooks')
  expect(container.querySelector('tbody .bar').style.width).toBe('100%')
})

test('the pie chart gives authors with at least ten quotes their own slice, repeating colors, and groups the rest', () => {
  const quotesBy = (author, count) => Array.from({length: count}, (_, i) => ({_id: `${author}${i}`, author, en: author}))
  const authors = Array.from({length: 9}, (_, i) => String.fromCharCode(65 + i))
  mount([...authors.flatMap(author => quotesBy(author, 10)), ...quotesBy('Z', 9)])
  expect(texts('.pie-chart li')).toEqual([
    ...authors.map(author => `${author}10 (10.1%)`), 'Other authors9 (9.1%)'
  ])
  const colors = [...container.querySelectorAll('.pie-chart path')].map(path => path.getAttribute('fill'))
  expect(colors[8]).toBe(colors[0])
  expect(new Set(colors.slice(0, 8)).size).toBe(8)
})

test('a single slice fills the whole pie', () => {
  mount([quotes[0]])
  expect(container.querySelectorAll('.pie-chart path')).toHaveLength(0)
  expect(container.querySelector('.pie-chart circle title').textContent).toBe('Other authors: 1 (100.0%)')
})

test('no quotes render no chart', () => {
  mount([])
  expect(container.querySelector('.pie-chart')).toBeNull()
  expect(texts('.meters .value')).toEqual(['0 / 0', '0 / 0', '0 / 0'])
})
