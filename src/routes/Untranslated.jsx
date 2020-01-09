import React from 'react'
import {useSelector} from 'react-redux'

import {useTranslate} from '../store/actions'
import Quotes from '../components/main/Quotes'

const Untranslated = () => {
  const {allQuotes, lang} = useSelector(state => state)
  const translate = useTranslate()
  const untranslated = allQuotes.filter(q => !q[lang])

  return (
    <main>
      <h1>{translate('UNTRANSLATED')}</h1>
      <Quotes quotes={untranslated} />
    </main>
  )
}

export default Untranslated
