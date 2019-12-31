import translations from '../data/translations'
import {store} from '../store'

export default function translate(key) {
  const {lang} = store.getState()
  return translations[lang][key] || key
}
