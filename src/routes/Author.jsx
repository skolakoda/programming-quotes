import React from 'react'
import {useParams} from 'react-router'
import {connect} from 'react-redux'

import Quotes from '../components/main/Quotes'
import AuthorBox from '../components/main/AuthorBox'
import {useTranslate} from '../shared/translate'
import {usePageTitle} from '../shared/usePageTitle'
import {displayName} from '../shared/helpers'
import NotFound from './NotFound'

function AuthorPage({author, authorQuotes, language, phrase}) {
  const translate = useTranslate()
  usePageTitle(displayName(author))
  const filtered = authorQuotes
    .filter(quote => quote[language] && quote[language].toLowerCase().includes(phrase.toLowerCase()))

  return (
    <main>
      <h1>{displayName(author)}</h1>
      <AuthorBox author={author} />
      {phrase && <small>{translate('SHOWING_RESULTS')} "{phrase}":</small>}
      <Quotes currentQuotes={filtered} />
    </main>
  )
}

function Author({language, allQuotes, phrase}) {
  const {name} = useParams()
  const author = name.replace(/_/g, ' ')
  const authorQuotes = allQuotes.filter(q => q.author === author)
  return authorQuotes.length
    ? <AuthorPage author={author} authorQuotes={authorQuotes} language={language} phrase={phrase} />
    : <NotFound />
}

const mapStateToProps = ({language, allQuotes, phrase}) => ({language, allQuotes, phrase})

export default connect(mapStateToProps)(Author)
