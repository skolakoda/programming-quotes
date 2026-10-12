import React from 'react'
import {useParams} from 'react-router'
import {connect} from 'react-redux'

import Quotes from '../components/main/Quotes'
import AuthorBox from '../components/main/AuthorBox'
import {useTranslate} from '../shared/translate'
import {displayName} from '../shared/helpers'

function Author({language, allQuotes, phrase}) {
  const translate = useTranslate()
  const {name} = useParams()
  const author = name.replace(/_/g, ' ')
  const filtered = allQuotes
    .filter(q => q.author === author)
    .filter(quote => quote[language] && quote[language].toLowerCase().includes(phrase.toLowerCase()))

  return (
    <main>
      <h1>{displayName(author)}</h1>
      <AuthorBox author={author} />
      {phrase && <small>{translate('SHOWING_RESULTS')} "{phrase}":</small>}
      <Quotes loaded={allQuotes.length} currentQuotes={filtered} />
    </main>
  )
}

const mapStateToProps = ({language, allQuotes, phrase}) => ({language, allQuotes, phrase})

export default connect(mapStateToProps)(Author)
