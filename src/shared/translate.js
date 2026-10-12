import {useSelector} from 'react-redux'
import translations from '../data/translations'

export function useTranslate() {
  const language = useSelector(state => state.language)
  const uiLanguage = language === 'stsl' ? 'sr' : language
  return key => translations[uiLanguage][key] || key
}
