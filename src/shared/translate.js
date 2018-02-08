import translations from '../data/translations'

export default function translate(key, lang) {
  return translations[translate.currentLanguage][key]
}

translate.currentLanguage = 'en'

translate.setLanguage = lang => translate.currentLanguage = lang
