import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'

import ImageQuote from './../components/main/ImageQuote'
import {useTranslate} from '../store/actions'
import {API} from '../config/api'
import {smoothscroll} from '../utils/helpers'

const getRandom = filteredQuotes =>
  filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)]

const RandomQuote = () => {
  const {filteredQuotes, lang} = useSelector(state => state)
  const translate = useTranslate()
  const [quote, setQuote] = useState(getRandom(filteredQuotes))

  useEffect(() => {
    if (quote) return
    fetch(`${API.randomLang}${lang}`)
      .then(res => res.json())
      .then(quote => setQuote(quote))
      .catch(() => setQuote(getRandom(filteredQuotes)))
  }, [filteredQuotes, lang, quote])

  const setRandom = () => {
    setQuote(getRandom(filteredQuotes))
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
