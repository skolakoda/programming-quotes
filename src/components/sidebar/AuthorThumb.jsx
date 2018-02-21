import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {fetchImage} from '../../shared/helpers'
import './AuthorThumb.css'

class AuthorThumb extends Component {
  constructor(props) {
    super(props)
    this.state = {image: ''}
  }

  componentDidMount() {
    fetchImage(this.props.authorName, '50', image => this.setState({image}))
  }

  render() {
    const {authorName} = this.props
    const link = `/author/${authorName}`
    return (
      <Link className="author" to={link}>
        <img src={this.state.image || '/images/unknown.jpg'} alt="author" />
        {authorName}
      </Link>
    )
  }
}

export default AuthorThumb
