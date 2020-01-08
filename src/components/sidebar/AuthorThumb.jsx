import React from 'react'
import {Link} from 'react-router-dom'

import {useAuthorName} from '../../store/actions'
import unknownImage from '../../assets/images/unknown.jpg'
import './AuthorThumb.css'

const AuthorThumb = ({ author, image }) => {
  const getName = useAuthorName()
  const link = `/author/${author.replace(/ /g, '_')}`

  return (
    <div className="author-wrap">
      <Link className="author" to={link}>
        <img src={image || unknownImage} alt="author" />
        {getName(author)}
      </Link>
      <label>
        <input type="checkbox" />
      </label>
    </div>
  )
}

export default AuthorThumb
