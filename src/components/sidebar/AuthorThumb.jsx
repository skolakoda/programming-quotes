import React from 'react'
import {Link} from 'react-router-dom'
import './AuthorThumb.css'

const AuthorThumb = ({ authorName, authorImage, setAuthor }) => {
  const link = `/author/${authorName}`
  return (
    <Link className="author" to={link}>
      <img src={authorImage || 'images/unknown.jpg'} alt="author" />
      {authorName}
    </Link>
  )}

export default AuthorThumb
