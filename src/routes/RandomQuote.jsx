import React, { useEffect, useState, useCallback } from 'react'
import {connect} from 'react-redux'

import ImageQuote from './../components/main/ImageQuote'
import translate from './../shared/translate'

const RandomQuote = ({ allQuotes, language }) => {

  const [quote, setQuote] = useState(null)
  window.scrollTo(0, 0)

  const getRandom = useCallback(() => {
    const langQuotes = allQuotes.filter(q => q[language])
    if (!langQuotes.length) return
    const quote = langQuotes[Math.floor(Math.random() * langQuotes.length)]
    setQuote(quote)
  }, [allQuotes, language])

  useEffect(() => {
    if (!quote) getRandom()
  }, [quote, getRandom])

  if (!quote) return null

  return (
    <main>
      <h1>{translate('QUOTE_OF_THE_DAY')}</h1>
      <ImageQuote quote={quote} cssClass="big-quote" />
      <button onClick={getRandom}>{translate('MORE_WISDOM')}</button>
    </main>
  )
}

const mapStateToProps = ({allQuotes, language}) => ({allQuotes, language})

export default connect(mapStateToProps)(RandomQuote)
