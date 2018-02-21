import React from 'react'
import AuthorThumb from './AuthorThumb'

const Authors = ({ authorImages, authors }) => {
  const preparedAuthors = [...authors].sort().map((author, i) =>
    <AuthorThumb key={i} authorName={author} />
  )
  return (
    <div className="authors">
      {preparedAuthors}
    </div>
  )
}

export default Authors
