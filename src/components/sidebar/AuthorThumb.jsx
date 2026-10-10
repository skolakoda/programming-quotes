import React from 'react'
import {Link} from 'react-router'
import unknownImage from '../../assets/images/unknown.jpg'
import './AuthorThumb.css'

export default function AuthorThumb({author, image}) {
  const link = `/author/${author.replace(/ /g, '_')}`
  return (
    <Link className="author" to={link}>
      <img src={image || unknownImage} alt="author" />
      {author}
    </Link>
  )
}
