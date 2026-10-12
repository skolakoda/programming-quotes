import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'

import ImageQuote from './../components/main/ImageQuote'
import {useTranslate} from './../shared/translate'
import {readQuoteHistory, saveQuoteHistory, selectRandomQuote} from '../shared/randomQuotes'

function RandomQuote({allQuotes, language}) {
  const translate = useTranslate()
  const [selection, setSelection] = useState(() => selectRandomQuote(allQuotes, language, readQuoteHistory()))
  useEffect(() => saveQuoteHistory(selection.history), [selection.history])
  let quote = selection.quote
  if (selection.allQuotes !== allQuotes || selection.language !== language) {
    const current = allQuotes.find(candidate => candidate._id === selection.quote?._id && candidate[language])
    const next = current && selection.language === language
      ? {...selection, allQuotes, quote: current}
      : selectRandomQuote(allQuotes, language, selection.history, current?._id)
    quote = next.quote
    setSelection(next)
  }
  const getRandom = () => setSelection(previous => selectRandomQuote(allQuotes, language, previous.history))

  return (
    <main>
      <h1>{translate('QUOTE_OF_THE_DAY')}</h1>
      {quote
        ? <ImageQuote quote={quote} cssClass="big-quote" />
        : <p>{translate('NO_TRANSLATION')}</p>
      }
      <button onClick={getRandom} disabled={!quote}>Gimme more!</button>
    </main>
  )
}

const mapStateToProps = ({allQuotes, language}) => ({allQuotes, language})

export default connect(mapStateToProps)(RandomQuote)
