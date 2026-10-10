import React, {Component} from 'react'
import translate from '../../shared/translate'
import './AuthorBox.css'

export default class AuthorInfo extends Component {
  requestId = 0

  constructor(props) {
    super(props)
    this.state = {info: '', error: false}
  }

  componentDidMount() {
    this.getInfo(this.props.author)
  }

  componentDidUpdate(prevProps) {
    if (this.props.author !== prevProps.author)
      this.getInfo(this.props.author)
  }

  componentWillUnmount() {
    this.requestId++
  }

  prepareInfo(info, author) {
    if (!info) return ''
    const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(author)}`
    return `${info} <a href="${wikiUrl}" target="_blank" rel="noopener noreferrer">Wikipedia</a>`
  }

  getInfo(author) {
    const requestId = ++this.requestId
    this.setState({info: '', error: false})
    fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(author)}&prop=extracts&format=json&origin=*&redirects=1&exsentences=2&exintro=1`)
      .then(response => {
        if (!response.ok) throw new Error(`Unable to load author biography: ${response.status}`)
        return response.json()
      })
      .then(obj => {
        if (requestId !== this.requestId) return
        if (!obj.query || !obj.query.pages) throw new Error('Missing author biography results')
        const page = Object.values(obj.query.pages).find(page => page.extract)
        this.setState({info: this.prepareInfo(page && page.extract, author)})
      })
      .catch(() => {
        if (requestId === this.requestId) this.setState({info: '', error: true})
      })
  }

  render() {
    if (this.state.error) return <small>{translate('NETWORK_PROBLEM')}</small>

    return (
      <small dangerouslySetInnerHTML={{__html: this.state.info}}></small>
    )
  }
}
