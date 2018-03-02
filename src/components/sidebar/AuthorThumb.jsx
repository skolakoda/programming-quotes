import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import unknownImage from '../../assets/images/unknown.jpg'
import './AuthorThumb.css'

export default class AuthorThumb extends Component {
  render() {
    const {author, image} = this.props
    const link = `/author/${author}`
    return (
      <Link className="author" to={link}>
        <img src={image || unknownImage} alt="author" />
        {author}
      </Link>
    )
  }
}
