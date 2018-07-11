import translations from '../data/translations'
import {store} from '../store'

export default function translate(key) {
  const {language} = store.getState()
  return translations[language][key] || key
}
