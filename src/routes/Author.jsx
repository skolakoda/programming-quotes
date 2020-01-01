import React from 'react'
import {connect} from 'react-redux'

import Paginated from '../components/main/Paginated'
import AuthorImage from '../components/main/AuthorImage'
import AuthorInfo from '../components/main/AuthorInfo'
import {useTranslate} from '../store/actions'
import {includes} from '../shared/helpers'
import './Author.css'

const Author = props => {
  const translate = useTranslate()
  const {lang, allQuotes, phrase, match} = props
  const author = match.params.name.replace(/_/g, ' ')

  const filtered = allQuotes
    .filter(q => q.author === author && includes(q[lang], phrase))

  return (
    <main>
      <h1>{author}</h1>
      <div className="thumbnail">
        <h3 className="hide-sm">{author}</h3>
        <AuthorImage author={author} />
        <AuthorInfo author={author} />
      </div>
      {phrase && <small>{translate('SHOWING_RESULTS')} "{phrase}":</small>}
      <Paginated loaded={allQuotes.length} filteredQuotes={filtered} />
    </main>
  )
}

const mapStateToProps = ({lang, allQuotes, phrase}) => ({lang, allQuotes, phrase})

export default connect(mapStateToProps)(Author)
