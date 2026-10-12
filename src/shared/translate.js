import {useSelector} from 'react-redux'
import translations from '../data/translations'
import {findLanguage} from './languages'

export function useTranslate() {
  const language = useSelector(state => state.language)
  return key => translations[findLanguage(language).ui][key] || key
}
