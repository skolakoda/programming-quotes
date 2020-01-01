import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'

import ImageQuote from './../components/main/ImageQuote'
import {useTranslate} from '../store/actions'

const getRand = (allQuotes, lang) => {
  const langQuotes = allQuotes.filter(q => q[lang])
  return langQuotes[Math.floor(Math.random() * langQuotes.length)]
}

const RandomQuote = () => {
  const {allQuotes, lang} = useSelector(state => state)
  const translate = useTranslate()
  const [quote, setQuote] = useState(getRand(allQuotes, lang))

  // proveriti da li su ucitani allQuotes, ako nisu slati ajax
  useEffect(() => {
    if (quote) return
    setQuote(getRand(allQuotes, lang))
    window.scrollTo(0, 0)
  }, [allQuotes, lang, quote])

  const setRand = () => {
    setQuote(getRand(allQuotes, lang))
  }

  if (!quote) return null

  return (
    <main>
      <h1>{translate('QUOTE_OF_THE_DAY')}</h1>
      <ImageQuote quote={quote} cssClass="big-quote" />
      <button onClick={setRand}>{translate('MORE_WISDOM')}</button>
    </main>
  )
}

export default RandomQuote
