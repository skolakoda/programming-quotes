import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'

import ImageQuote from './../components/main/ImageQuote'
import {useTranslate} from '../store/actions'
import {API} from '../config/api'
import {smoothscroll} from '../shared/helpers'

const getRandom = (allQuotes, lang) => {
  const langQuotes = allQuotes.filter(q => q[lang])
  return langQuotes[Math.floor(Math.random() * langQuotes.length)]
}

const RandomQuote = () => {
  const {allQuotes, lang} = useSelector(state => state)
  const translate = useTranslate()
  const [quote, setQuote] = useState(getRandom(allQuotes, lang))

  useEffect(() => {
    if (quote) return
    fetch(`${API.randomLang}${lang}`)
      .then(res => res.json())
      .then(quote => setQuote(quote))
  }, [lang, quote])

  const setRandom = () => {
    setQuote(getRandom(allQuotes, lang))
    smoothscroll()
  }

  if (!quote) return null

  return (
    <main>
      <h1>{translate('QUOTE_OF_THE_DAY')}</h1>
      <ImageQuote quote={quote} cssClass="big-quote" />
      <button onClick={setRandom}>{translate('MORE_WISDOM')}</button>
    </main>
  )
}

export default RandomQuote
