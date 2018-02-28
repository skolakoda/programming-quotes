import React, {Component} from 'react'

class AuthorImage extends Component {
  render() {
    return (
      <img className="main-image" src={this.props.src} alt={this.props.author} />
    )
  }
}
export default AuthorImage
