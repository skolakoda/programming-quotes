import React, {Component} from 'react'
import AuthorImage from './AuthorImage'
import {findValue} from '../../shared/helpers'
import unknownImage from '../../images/unknown.jpg'
import './AuthorBox.css'

export default class AuthorBox extends Component {
  constructor(props) {
    super(props)
    this.state = {image: '', info: ''}
  }

  componentDidMount() {
    this.getImage(this.props.author)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.author !== nextProps.author)
      this.getImage(nextProps.author)
  }

  prepareInfo(info) {
    if (!info) return ''
    const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(this.props.author)}`
    return `${info} <a href=${wikiUrl} target="_blank">Wikipedia</a>`
  }

  getImage(author) {
    this.setState({image: '', info: ''})
    fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(author)}&prop=pageimages|extracts&format=json&pithumbsize=300&origin=*&redirects=1&exsentences=2&exintro=1`)
      .then(response => response.json())
      .then(obj => {
        const image = findValue(obj, 'source')
        const info = findValue(obj, 'extract')
        this.setState({
          info: this.prepareInfo(info),
          image: image || unknownImage}
        )
      })
  }

  render() {
    const { author } = this.props
    return (
      <div className="thumbnail">
        <h3>{author}</h3>
        <AuthorImage author={author} src={this.state.image} />
        <small dangerouslySetInnerHTML={{__html: this.state.info}}></small>
      </div>
    )
  }
}
