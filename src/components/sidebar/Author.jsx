import React from 'react';
import './Author.css'

const Author = ({ authorName, authorImage, setAuthor }) => (
  <div className="author" onClick={() => setAuthor(authorName)}>
    {authorImage ? <img src={authorImage} alt={authorName} /> : ''}
    {authorName}
  </div>
)

export default Author
