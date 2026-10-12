import {LS} from '../config/localstorage'

// `lang` is the BCP 47 tag of the quote text; `ui` is the language of the interface translations.
export const languages = [
  {code: 'en', lang: 'en', ui: 'en', name: 'English'},
  {code: 'sr', lang: 'sr', ui: 'sr', name: 'Srpski'},
  {code: 'stsl', lang: 'cu', ui: 'sr', name: 'Словѣньскъ'}
]

export const findLanguage = code => languages.find(language => language.code === code) || languages[0]

export function readSavedLanguage() {
  try {
    return findLanguage(localStorage.getItem(LS.language)).code
  } catch {
    return languages[0].code
  }
}

export function saveLanguage(code) {
  try {
    localStorage.setItem(LS.language, code)
  } catch {
    // The selected language still applies until the page is reloaded.
  }
}
