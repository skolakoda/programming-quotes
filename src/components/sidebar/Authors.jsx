import React from 'react';
import './Authors.css'

const Authors = ({ authorImages, authors, setAuthor }) => {
  const sortedAuthors = [...authors].sort()
  const preparedAuthors = sortedAuthors.map((author, i) =>
    <div className="author" key={i} onClick={() => setAuthor(author)}>
      {authorImages.get(author) ? <img src={authorImages.get(author)} alt={author} /> : ''}
      {author}
    </div>
  )
  return (
    <div className="authors">
      {preparedAuthors}
    </div>
  )
}

export default Authors
