import React, {Component} from 'react'
import {fetchImage} from '../../shared/helpers'
import './Picture.css'

class Picture extends Component {
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
    fetchImage(author, '250', src =>
      this.setState({image: src || '/images/unknown.jpg'}))
  }

  render() {
    const { author } = this.props
    return (
      <div className="thumbnail">
        <h3>{author}</h3>
        <img className="main-image" src={this.state.image} alt={author} />
      </div>
    )
  }
}
export default Picture
