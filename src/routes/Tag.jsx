import React from 'react'
import {useParams} from 'react-router'
import {connect} from 'react-redux'

import Quotes from '../components/main/Quotes'
import NotFound from './NotFound'
import {useTranslate} from '../shared/translate'
import {usePageTitle} from '../shared/usePageTitle'
import {tags, tagLabelKey} from '../shared/tags'

function TagPage({tag, language, allQuotes, phrase}) {
  const translate = useTranslate()
  const label = translate(tagLabelKey(tag))
  usePageTitle(label)
  const filtered = allQuotes
    .filter(quote => quote.tags?.includes(tag))
    .filter(quote => quote[language] && quote[language].toLowerCase().includes(phrase.toLowerCase()))

  return (
    <main>
      <h1>{label}</h1>
      {phrase && <small>{translate('SHOWING_RESULTS')} "{phrase}":</small>}
      <Quotes currentQuotes={filtered} />
    </main>
  )
}

function Tag(props) {
  const {tag} = useParams()
  return tags.includes(tag) ? <TagPage tag={tag} {...props} /> : <NotFound />
}

const mapStateToProps = ({language, allQuotes, phrase}) => ({language, allQuotes, phrase})

export default connect(mapStateToProps)(Tag)
