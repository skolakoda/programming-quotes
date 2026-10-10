import translations from '../data/translations'
import {store} from '../store'

export default function translate(key) {
  const {language} = store.getState()
  const uiLanguage = language === 'stsl' ? 'sr' : language
  return translations[uiLanguage][key] || key
}
