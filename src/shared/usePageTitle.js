import {useEffect} from 'react'
import {useTranslate} from './translate'

export function usePageTitle(title) {
  const translate = useTranslate()
  const site = translate('PROGRAMMING_QUOTES')
  const fullTitle = title ? `${title} | ${site}` : site
  useEffect(() => { document.title = fullTitle }, [fullTitle])
}
