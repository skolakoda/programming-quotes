import React from 'react'
import {Link} from 'react-router-dom'

import {useAuthorName} from '../../store/actions'
import unknownImage from '../../assets/images/unknown.jpg'
import './AuthorThumb.css'

const AuthorThumb = ({ author, image }) => {
  const getName = useAuthorName()
  const link = `/author/${author.replace(/ /g, '_')}`

  // TODO: selektovati autore ako su u filteredAuthors

  return (
    <div className="author-wrap">
      <Link className="author" to={link}>
        <img src={image || unknownImage} alt="author" />
        {getName(author)}
      </Link>
      <label>
        <input type="checkbox" value={author} checked={Math.random() > .5} />
      </label>
    </div>
  )
}

export default AuthorThumb
