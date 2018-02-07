import React from 'react';
import Author from './Author'

const Authors = ({ authorImages, authors, setAuthor }) => {
  const sortedAuthors = [...authors].sort()
  const preparedAuthors = sortedAuthors.map((author, i) =>
    <Author key={i} authorName={author} authorImage={authorImages.get(author)} setAuthor={setAuthor} />
  )
  return (
    <div className="authors">
      {preparedAuthors}
    </div>
  )
}

export default Authors
