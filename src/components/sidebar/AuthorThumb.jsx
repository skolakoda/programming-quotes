import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'

import {useAuthorName, filterQuotes, toggleSelectedAuthors} from '../../store/actions'
import unknownImage from '../../assets/images/unknown.jpg'
import './AuthorThumb.css'

const AuthorThumb = ({ author, image }) => {
  const dispatch = useDispatch()
  const authorName = useAuthorName()
  const {selectedAuthors} = useSelector(state => state)
  const link = `/autor/${author.replace(/ /g, '_')}`

  const handleCheck = ({target}) => {
    const {checked, value} = target
    dispatch(toggleSelectedAuthors(checked, value))
    dispatch(filterQuotes())
  }

  return (
    <div className="author-wrap">
      <Link className="author" to={link}>
        <img src={image || unknownImage} alt="author" />
        {authorName(author)}
      </Link>
      <label>
        <input
          type="checkbox"
          value={author}
          checked={selectedAuthors.has(author)}
          onChange={handleCheck}
        />
      </label>
    </div>
  )
}

export default AuthorThumb
