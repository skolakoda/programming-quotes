import en from '../translations/en'
import sr from '../translations/sr'

const translations = { en, sr }

export default function translate(key, lang) {
  return translations[lang][key]
}
