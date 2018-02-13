import React from 'react'
import './AuthorThumb.css'

const AuthorThumb = ({ authorName, authorImage, setAuthor }) => (
  <div className="author" onClick={() => setAuthor(authorName)}>
    <img src={authorImage} alt="author" />
    {authorName}
  </div>
)

export default AuthorThumb
