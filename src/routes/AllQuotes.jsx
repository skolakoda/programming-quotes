import React from 'react'
import {connect} from 'react-redux'

import translate from '../shared/translate'
import Quotes from '../components/main/Quotes'

const AllQuotes = ({ language, allQuotes, phrase }) => {
  const filtered = allQuotes
    .filter(quote => quote[language] && quote[language].toLowerCase().includes(phrase.toLowerCase()))

  return (
    <main>
      <h1>{translate('PROGRAMMING_QUOTES')}</h1>
      {phrase && <small>{translate('SHOWING_RESULTS')} "{phrase}":</small>}
      <Quotes loaded={allQuotes.length} currentQuotes={filtered} />
    </main>
  )
}

const mapStateToProps = ({language, allQuotes, phrase}) => ({language, allQuotes, phrase})

export default connect(mapStateToProps)(AllQuotes)
