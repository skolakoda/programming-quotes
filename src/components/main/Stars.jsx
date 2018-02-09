import React, { Component } from 'react'
import ReactStars from 'react-stars'

class Stars extends Component {
  constructor(props) {
    super(props)
    this.state = {
      edit: true,
      rated: false,
      rating: Number(this.props.rating)
    }
  }

  rate = newRating => {
    if (this.state.rated) return
    const http = new XMLHttpRequest()
    http.open('POST', 'https://baza-podataka.herokuapp.com/oceni-citat/')
    http.setRequestHeader('Content-type', 'application/json')
    http.onload = () => this.setState({ rating: Number(http.responseText) })
    http.send(JSON.stringify({ '_id': this.props.id, 'novaOcena': newRating }))
    this.setState({
      edit: false,
      rated: true
    })
  }

  render() {
    return (
      <ReactStars size={20} value={this.state.rating} onChange={this.rate} edit={this.state.edit} />
    )
  }
}

export default Stars
