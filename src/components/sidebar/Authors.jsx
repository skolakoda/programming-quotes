import React from 'react'
import AuthorThumb from './AuthorThumb'
const shortid = require('shortid')

const Authors = ({ authors }) => {
  const preparedAuthors = [...authors].sort().map(author =>
    <AuthorThumb key={shortid.generate()} author={author} />
  )
  return (
    <div className="authors">
      {preparedAuthors}
    </div>
  )
}

export default Authors
