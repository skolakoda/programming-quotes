import React from 'react'
import {useSelector} from 'react-redux'

import Paginated from '../components/main/Paginated'
import AuthorImage from '../components/main/AuthorImage'
import AuthorInfo from '../components/main/AuthorInfo'

import './Author.css'

const Author = ({match}) => {
  const {filteredQuotes} = useSelector(state => state)

  const author = match.params.name.replace(/_/g, ' ')

  const filtered = filteredQuotes.filter(q => q.author === author)

  return (
    <main>
      <h1>{author}</h1>
      <div className="thumbnail">
        <h3 className="hide-sm">{author}</h3>
        <AuthorImage author={author} />
        <AuthorInfo author={author} />
      </div>
      <Paginated filteredQuotes={filtered} />
    </main>
  )
}

export default Author
