import React from 'react'
import {useSelector} from 'react-redux'

import Quotes from '../components/main/Quotes'
import AuthorImage from '../components/main/AuthorImage'
import AuthorInfo from '../components/main/AuthorInfo'
import {useAuthorName} from '../store/actions'
import './Author.css'

const Author = ({match}) => {
  const {filteredQuotes} = useSelector(state => state)
  const getName = useAuthorName()

  const author = match.params.name.replace(/_/g, ' ')
  const filtered = filteredQuotes.filter(q => q.author === author)

  return (
    <main>
      <h1>{getName(author)}</h1>
      <div className="thumbnail">
        <h3 className="hide-sm">{getName(author)}</h3>
        <AuthorImage author={author} />
        <AuthorInfo author={author} />
      </div>
      <Quotes quotes={filtered} />
    </main>
  )
}

export default Author
