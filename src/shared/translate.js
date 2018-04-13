import translations from '../data/translations'
import {store} from '../state/reducer'

export default function translate(key, lang) {
  return translations[store.getState().language][key] || key
}
