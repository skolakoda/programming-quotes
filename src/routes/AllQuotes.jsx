import React from 'react'
import {connect} from 'react-redux'

import {useTranslate} from '../store/actions'
import Quotes from '../components/main/Quotes'
import {includes} from '../shared/helpers'

const AllQuotes = ({ lang, allQuotes, phrase }) => {
  const translate = useTranslate()
  const filtered = allQuotes
    .filter(quote => includes(quote[lang], phrase))

  return (
    <main>
      <h1>{translate('ALL_QUOTES')}</h1>
      {phrase && <small>{translate('SHOWING_RESULTS')} "{phrase}":</small>}
      <Quotes loaded={allQuotes.length} currentQuotes={filtered} />
    </main>
  )
}

const mapStateToProps = ({lang, allQuotes, phrase}) => ({lang, allQuotes, phrase})

export default connect(mapStateToProps)(AllQuotes)
