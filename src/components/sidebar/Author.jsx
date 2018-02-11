import React from 'react'
import {Link} from 'react-router-dom'
import './Author.css'

const Author = ({ authorName, authorImage, setAuthor }) => (
  <Link className="author no-link" to={`/author/${authorName}`}>
    <img src={authorImage} alt="author" />
    {authorName}
  </Link>
)

export default Author
