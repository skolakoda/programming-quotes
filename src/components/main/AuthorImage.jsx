import React, {Component} from 'react'
import {findValue} from '../../shared/helpers'
import unknownImage from '../../images/unknown.jpg'

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

  // TODO: prebaciti ucitavanje slike i info na roditelja

  fetchImage(title, size, callback) {
    fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages|extracts&format=json&pithumbsize=${size}&origin=*&redirects=1&exintro`)
      .then(response => response.json())
      .then(obj => {
        const imgSrc = findValue(obj, 'source')
        const info = findValue(obj, 'extract')
        console.log(info)
        callback(imgSrc)
      })
  }

  getImage(author) {
    this.setState({image: ''})
    const alternative = this.props.showUnknown ? unknownImage : ''
    this.fetchImage(author, '250', src =>
      this.setState({image: src || alternative}))
  }

  render() {
    if (!this.state.image) return null

    return (
      <img className="main-image" src={this.state.image} alt={this.props.author} />
    )
  }
}
export default AuthorImage
