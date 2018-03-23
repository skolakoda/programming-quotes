import React, {Component} from 'react'
import unknownImage from '../../assets/images/unknown.jpg'

const responsiveBreakpoint = 800

class AuthorImage extends Component {
  constructor() {
    super()
    this.state = {loaded: false}
  }

  componentDidMount() {
    this.setState({loaded: false}, () =>
      this.setImage(this.props))
  }

  componentWillReceiveProps(nextProps) {
    const {author, allImages} = this.props
    const loaded = (author === nextProps.author) && Boolean(allImages.get(author))
    this.setState({loaded}, () =>
      this.setImage(nextProps))
  }

  setImage(props) {
    const {author, allImages, showUnknown} = props
    const src = allImages.get(author)
    const imgWidth = window.innerWidth < responsiveBreakpoint ? window.innerWidth : 250
    const unknown = showUnknown ? unknownImage : ''
    const newSrc = src ? src.replace(/\d+px/, `${imgWidth}px`) : unknown
    this.setState({src: newSrc})
  }

  render() {
    return (
      <img
        className="main-image"
        src={this.state.src}
        style={this.state.loaded ? {} : {display: 'none'}}
        onLoad={() => this.setState({loaded: true})}
        alt={'author'}
      />
    )
  }
}

export default AuthorImage
