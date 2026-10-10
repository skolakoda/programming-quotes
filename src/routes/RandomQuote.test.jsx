import React from 'react'
import {vi} from 'vitest'
import {act, render, unmount} from '../test/render'
import {Provider} from 'react-redux'
import {MemoryRouter} from 'react-router-dom'
import {createStore} from 'redux'
import RandomQuote from './RandomQuote'
import {reducer} from '../store/reducer'
import {setLanguage, setAllQuotes} from '../store/actions'

vi.mock('../components/main/AuthorImage', () => ({default: () => null}))

const englishOnly = {_id: 'english', author: 'English Author', en: 'English only quote', sr: '', rating: 4}
const bilingual = {_id: 'both', author: 'Bilingual Author', en: 'Bilingual quote', sr: 'Citat sa prevodom', rating: 4}
let container

beforeEach(() => {
  container = document.createElement('div')
  vi.spyOn(Math, 'random').mockReturnValue(0)
})

afterEach(() => {
  unmount(container)
  vi.restoreAllMocks()
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

test('keeps the current quote when it has a translation in the selected language', () => {
  const store = mountQuotes([bilingual, englishOnly])

  act(() => store.dispatch(setLanguage('sr')))
  act(() => store.dispatch(setLanguage('en')))

  expect(container.querySelector('.quote-text').textContent).toContain(bilingual.en)
  expect(container.querySelector('.quote-text a').getAttribute('href')).toBe('/quote/both')
})

test('clears an unavailable quote and recovers when the language changes back', () => {
  const store = mountQuotes([englishOnly])

  act(() => store.dispatch(setLanguage('sr')))

  expect(container.querySelector('.quote-text')).toBeNull()
  expect(container.querySelector('main').textContent).toContain('No translation for this quote.')
  expect(container.querySelector('button').disabled).toBe(true)

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

test('refreshes the selected quote when the server replaces its data', () => {
  const store = mountQuotes([bilingual])

  act(() => store.dispatch(setAllQuotes([{...bilingual, en: 'Updated quote'}])))

  expect(container.querySelector('.quote-text').textContent).toContain('Updated quote')
  expect(container.querySelector('.quote-text a').getAttribute('href')).toBe('/quote/both')
})
