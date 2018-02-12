import React from 'react'
import './AuthorThumb.css'

const AuthorThumb = ({ authorName, authorImage, setAuthor }) => (
  <div className="author" onClick={() => setAuthor(authorName)}>
    {authorImage ? <img src={authorImage} alt={authorName} /> : ''}
    {authorName}
  </div>
)

export default AuthorThumb
