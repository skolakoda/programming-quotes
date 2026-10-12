import React from 'react'
import {vi} from 'vitest'
import {act, render, unmount} from '../test/render'
import {Provider} from 'react-redux'
import {MemoryRouter} from 'react-router'
import {createStore} from 'redux'
import RandomQuote from './RandomQuote'
import {reducer} from '../store/reducer'
import {setLanguage, setAllQuotes} from '../store/actions'
import {LS} from '../config/localstorage'

vi.mock('../components/main/AuthorImage', () => ({default: () => null}))

const englishOnly = {_id: 'english', author: 'English Author', en: 'English only quote', sr: '', rating: 4}
const bilingual = {_id: 'both', author: 'Bilingual Author', en: 'Bilingual quote', sr: 'Citat sa prevodom', rating: 4}
let container

beforeEach(() => {
  localStorage.clear()
  container = document.createElement('div')
  vi.spyOn(Math, 'random').mockReturnValue(0.99)
})

afterEach(() => {
  unmount(container)
  vi.restoreAllMocks()
  localStorage.clear()
})

function mountQuotes(allQuotes) {
  const store = createStore(reducer, {...reducer(undefined, {}), allQuotes, language: 'en'})
  render(
    <Provider store={store}>
      <MemoryRouter><RandomQuote /></MemoryRouter>
    </Provider>, container
  )
  return store
}

test('switching language selects a translated quote when the current one has no translation', () => {
  const store = mountQuotes([englishOnly, bilingual])
  expect(container.querySelector('.quote-text').textContent).toContain(englishOnly.en)

  act(() => store.dispatch(setLanguage('sr')))

  expect(container.querySelector('.quote-text').textContent).toContain(bilingual.sr)
  expect(container.textContent).not.toContain(englishOnly.en)
})

test('keeps the same quote when switching languages and continues with unseen quotes', () => {
  const store = mountQuotes([bilingual, englishOnly])

  act(() => store.dispatch(setLanguage('sr')))
  expect(container.querySelector('.quote-text').textContent).toContain(bilingual.sr)
  act(() => store.dispatch(setLanguage('en')))

  expect(container.querySelector('.quote-text').textContent).toContain(bilingual.en)
  expect(currentId()).toBe('both')
  expect(nextQuote()).toBe('english')
})

test('clears an unavailable quote and recovers when the language changes back', () => {
  const store = mountQuotes([englishOnly])

  act(() => store.dispatch(setLanguage('sr')))

  expect(container.querySelector('.quote-text')).toBeNull()
  expect(container.querySelector('main').textContent).toContain('Nema prevoda za ovaj citat.')
  expect(container.querySelector('button').disabled).toBe(true)
  expect(container.querySelector('button').textContent).toBe('Daj još!')

  act(() => store.dispatch(setLanguage('en')))

  expect(container.querySelector('.quote-text').textContent).toContain(englishOnly.en)
  expect(container.querySelector('button').disabled).toBe(false)
})

test('uses quotes arriving later with the currently selected language', () => {
  const store = mountQuotes([])
  act(() => store.dispatch(setLanguage('sr')))

  act(() => store.dispatch(setAllQuotes([englishOnly, bilingual])))

  expect(container.querySelector('.quote-text').textContent).toContain(bilingual.sr)
})

test('refreshes the selected quote when its data is replaced', () => {
  const store = mountQuotes([bilingual])

  act(() => store.dispatch(setAllQuotes([{...bilingual, en: 'Updated quote'}])))

  expect(container.querySelector('.quote-text').textContent).toContain('Updated quote')
  expect(container.querySelector('.quote-text a').getAttribute('href')).toBe('/quote/both')
})

const thirdQuote = {_id: 'third', author: 'Third Author', en: 'Third quote', stsl: 'Третиє ·', rating: 4}

function currentId() {
  return container.querySelector('.quote-text a').getAttribute('href').split('/').pop()
}

function nextQuote() {
  act(() => container.querySelector('button').click())
  return currentId()
}

test('shuffles once and displays every quote before starting another cycle', () => {
  mountQuotes([englishOnly, bilingual, thirdQuote])
  expect(Math.random).toHaveBeenCalledTimes(2)
  const firstCycle = [currentId(), nextQuote(), nextQuote()]
  expect(new Set(firstCycle).size).toBe(3)
  expect(Math.random).toHaveBeenCalledTimes(2)
  const secondCycle = [nextQuote(), nextQuote(), nextQuote()]
  expect(new Set(secondCycle).size).toBe(3)
  expect(secondCycle[0]).not.toBe(firstCycle[2])
  expect(Math.random).toHaveBeenCalledTimes(4)
})

test('resumes the remaining shuffled quotes after leaving or reloading the page', () => {
  mountQuotes([englishOnly, bilingual, thirdQuote])
  const first = currentId()
  const second = nextQuote()
  unmount(container)
  mountQuotes([englishOnly, bilingual, thirdQuote])
  expect(currentId()).not.toBe(first)
  expect(currentId()).not.toBe(second)
  expect(Math.random).toHaveBeenCalledTimes(2)
})

test('keeps a separate cycle for staroslavonic and resumes it after language changes', () => {
  const quotes = [englishOnly, {...bilingual, stsl: 'Первꙑи ·'}, thirdQuote]
  const store = mountQuotes(quotes)
  act(() => store.dispatch(setLanguage('stsl')))
  const first = currentId()
  expect(container.querySelector('.quote-text').textContent).toContain('Первꙑи ·')
  act(() => store.dispatch(setLanguage('en')))
  act(() => store.dispatch(setLanguage('stsl')))
  expect(currentId()).toBe(first)
  expect(nextQuote()).toBe('third')
  expect(container.querySelector('.quote-text').textContent).toContain(thirdQuote.stsl)
})

test('removes a retained translation from the pending queue without reshuffling the rest', () => {
  localStorage.setItem(LS.quoteHistory, JSON.stringify({stsl: {
    remaining: ['both', 'third'], known: ['both', 'third'], lastId: 'old'
  }}))
  const store = mountQuotes([thirdQuote, {...bilingual, stsl: 'Первꙑи ·'}])
  const randomCalls = Math.random.mock.calls.length
  act(() => store.dispatch(setLanguage('stsl')))
  expect(currentId()).toBe('third')
  expect(nextQuote()).toBe('both')
  expect(Math.random).toHaveBeenCalledTimes(randomCalls)
})

test('switching languages keeps a viewed translation without starting a new cycle', () => {
  const quotes = [{...bilingual, stsl: 'Первꙑи ·'}, thirdQuote]
  const store = mountQuotes(quotes)
  act(() => store.dispatch(setLanguage('stsl')))
  nextQuote()
  const randomCalls = Math.random.mock.calls.length
  act(() => store.dispatch(setLanguage('en')))
  expect(currentId()).toBe('third')
  act(() => store.dispatch(setLanguage('stsl')))
  expect(currentId()).toBe('third')
  expect(Math.random).toHaveBeenCalledTimes(randomCalls)
})

test('adds newly available quotes and skips removed quotes without restarting the cycle', () => {
  const store = mountQuotes([englishOnly, bilingual, thirdQuote])
  const added = {_id: 'added', author: 'New Author', en: 'New quote', rating: 4}
  act(() => store.dispatch(setAllQuotes([englishOnly, thirdQuote, added])))
  expect(currentId()).toBe('english')
  expect(nextQuote()).toBe('third')
  expect(nextQuote()).toBe('added')
})

test('recovers from invalid saved history', () => {
  localStorage.setItem(LS.quoteHistory, '{broken json')
  mountQuotes([englishOnly, bilingual])
  expect(currentId()).not.toBe(nextQuote())
})

test('still completes the cycle when browser storage is unavailable', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Blocked') })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Blocked') })
  mountQuotes([englishOnly, bilingual, thirdQuote])
  expect(new Set([currentId(), nextQuote(), nextQuote()]).size).toBe(3)
})
