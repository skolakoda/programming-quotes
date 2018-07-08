import translations from '../data/translations'

export default function translate(key, lang) {
  return translations[translate.currentLanguage][key] || key
}

translate.currentLanguage = 'sr'

translate.setLanguage = lang => translate.currentLanguage = lang
