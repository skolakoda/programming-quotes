import React from 'react'
import AuthorThumb from './AuthorThumb'

const Authors = ({ authorImages, authors, setAuthor }) => {
  const sortedAuthors = [...authors].sort()
  const preparedAuthors = sortedAuthors.map((author, i) =>
    <AuthorThumb key={i} authorName={author} authorImage={authorImages.get(author)} setAuthor={setAuthor} />
  )
  return (
    <div className="authors">
      {preparedAuthors}
    </div>
  )
}

export default Authors
