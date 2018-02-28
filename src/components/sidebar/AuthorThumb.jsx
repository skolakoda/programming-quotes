import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {fetchImage} from '../../shared/helpers'
import unknownImage from '../../assets/images/unknown.jpg'
import './AuthorThumb.css'

class AuthorThumb extends Component {
  constructor(props) {
    super(props)
    this.state = {image: ''}
  }

  componentDidMount() {
    fetchImage(this.props.author, '50', image => this.setState({image}))
  }

  render() {
    const author = this.props.author
    const link = `/author/${author}`
    return (
      <Link className="author" to={link}>
        <img src={this.state.image || unknownImage} alt="author" />
        {author}
      </Link>
    )
  }
}

export default AuthorThumb
