import React from 'react'
import AuthorImage from './AuthorImage'
import AuthorInfo from './AuthorInfo'
import {displayName} from '../../shared/helpers'
import './AuthorBox.css'

export default function AuthorBox({author}) {
  return (
    <div className="thumbnail">
      <h3 className="hide-sm">{displayName(author)}</h3>
      <AuthorImage author={author} showUnknown={true} />
      <AuthorInfo author={author} />
    </div>
  )
}
