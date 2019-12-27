import React, { useEffect, useState, useCallback } from 'react'
import {connect} from 'react-redux'

import ImageQuote from './../components/main/ImageQuote'
import translate from './../shared/translate'

const RandomQuote = ({ allQuotes, language }) => {

  const [quote, setQuote] = useState(null)

  const getRandom = useCallback(() => {
    const langQuotes = allQuotes.filter(q => q[language])
    if (!langQuotes.length) return
    const quote = langQuotes[Math.floor(Math.random() * langQuotes.length)]
    setQuote(quote)
    window.scrollTo(0, 0)
  }, [allQuotes, language])

  useEffect(() => {
    if (!quote) getRandom()
  }, [quote, getRandom])

  if (!quote) return null

  return (
    <main>
      <h1>{translate('QUOTE_OF_THE_DAY')}</h1>
      <ImageQuote quote={quote} cssClass="big-quote" />
      <button onClick={getRandom}>Još mudrosti!</button>
    </main>
  )
}

const mapStateToProps = ({allQuotes, language}) => ({allQuotes, language})

export default connect(mapStateToProps)(RandomQuote)
