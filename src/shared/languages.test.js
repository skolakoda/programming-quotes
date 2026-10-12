import {vi} from 'vitest'
import {readSavedLanguage, saveLanguage} from './languages'
import {LS} from '../config/localstorage'

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

test('restores a saved language and falls back to English for unknown values', () => {
  saveLanguage('stsl')
  expect(readSavedLanguage()).toBe('stsl')
  localStorage.setItem(LS.language, 'de')
  expect(readSavedLanguage()).toBe('en')
})

test('blocked storage falls back to English and does not break saving', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Storage blocked') })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Storage blocked') })
  expect(readSavedLanguage()).toBe('en')
  expect(() => saveLanguage('sr')).not.toThrow()
})
