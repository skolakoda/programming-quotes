import React, {Component} from 'react'
import {fetchImage} from '../../shared/helpers'
import unknownImage from '../../assets/images/unknown.jpg'

const responsiveBreakpoint = 800

export default class AuthorImage extends Component {
  requestId = 0

  constructor() {
    super()
    this.state = {
      loaded: false,
      src: '',
    }
  }

  componentDidMount() {
    this.setImage(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.author !== nextProps.author || this.props.showUnknown !== nextProps.showUnknown)
      this.setImage(nextProps)
  }

  componentWillUnmount() {
    this.requestId++
  }

  setImage(props) {
    const {author, showUnknown} = props
    const requestId = ++this.requestId
    const imgWidth = window.innerWidth < responsiveBreakpoint ? window.innerWidth : 250
    const unknown = showUnknown ? unknownImage : ''
    this.setState({loaded: false, src: ''})
    fetchImage(author, imgWidth)
      .catch(() => undefined)
      .then(src => {
        if (requestId === this.requestId) this.setState({src: src || unknown})
      })
  }

  handleError = () => {
    const src = this.props.showUnknown && this.state.src !== unknownImage ? unknownImage : ''
    this.setState({loaded: false, src})
  }

  render() {
    if (!this.state.src) return null

    return (
      <img
        className="main-image"
        src={this.state.src}
        style={this.state.loaded ? {} : {display: 'none'}}
        onLoad={() => this.setState({loaded: true})}
        onError={this.handleError}
        alt={this.props.author}
      />
    )
  }
}
