import React, {useState} from 'react'
import {connect} from 'react-redux'

import ImageQuote from './../components/main/ImageQuote'
import translate from './../shared/translate'

function pickRandom(allQuotes, language) {
  const translated = allQuotes.filter(quote => quote[language])
  return translated.length ? translated[Math.floor(Math.random() * translated.length)] : null
}

function RandomQuote({allQuotes, language}) {
  const [selection, setSelection] = useState(() => ({allQuotes, language, quote: pickRandom(allQuotes, language)}))
  let quote = selection.quote
  if (selection.allQuotes !== allQuotes || selection.language !== language) {
    quote = allQuotes.find(candidate => candidate._id === selection.quote?._id && candidate[language])
      || pickRandom(allQuotes, language)
    setSelection({allQuotes, language, quote})
  }
  const getRandom = () => setSelection({allQuotes, language, quote: pickRandom(allQuotes, language)})

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
