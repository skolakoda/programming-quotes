import React, {Component} from 'react'
import {findValue} from '../../shared/helpers'
import './AuthorBox.css'

export default class AuthorInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {info: ''}
  }

  componentDidMount() {
    this.getInfo(this.props.author)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.author !== nextProps.author)
      this.getInfo(nextProps.author)
  }

  prepareInfo(info) {
    if (!info) return ''
    const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(this.props.author)}`
    return `${info} <a href=${wikiUrl} target="_blank">Wikipedia</a>`
  }

  getInfo(author) {
    this.setState({info: ''})
    fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(author)}&prop=extracts&format=json&origin=*&redirects=1&exsentences=2&exintro=1`)
      .then(response => response.json())
      .then(obj => {
        const info = findValue(obj, 'extract')
        this.setState({info: this.prepareInfo(info)}
        )
      })
  }

  render() {
    return (
      <small dangerouslySetInnerHTML={{__html: this.state.info}}></small>
    )
  }
}
