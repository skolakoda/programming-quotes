import React, {Component} from 'react'
// import {findVal} from '../../shared/helpers'
import unknownImage from '../../images/unknown.jpg'

function findVal(object, key) {
  let value
  Object.keys(object).some(k => {
    if (k === key) value = object[k]
    if (typeof object[k] === 'object') value = findVal(object[k], key)
  })
  return value
}

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
        const imgSrc = findVal(obj, 'source')
        const info = findVal(obj, 'extract')
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
