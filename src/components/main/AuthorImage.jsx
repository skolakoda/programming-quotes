import React, {Component} from 'react'
import {fetchImage} from '../../shared/helpers'

class AuthorImage extends Component {
  constructor(props) {
    super(props)
    this.state = {image: ''}
  }

  componentDidMount() {
    this.getImage(this.props.author)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.author !== nextProps.author)
      this.getImage(nextProps.author)
  }

  getImage(author) {
    this.setState({image: ''})
    const unknown = this.props.showUnknown ? '/images/unknown.jpg' : ''
    fetchImage(author, '250', src =>
      this.setState({image: src || unknown}))
  }

  render() {
    if (!this.state.image) return null

    return (
      <img className="main-image" src={this.state.image} alt={this.props.author} />
    )
  }
}
export default AuthorImage
