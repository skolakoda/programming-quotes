import React, { Component } from 'react'
import ReactStars from 'react-stars'
import { vote } from '../../shared/helpers'
import './stars.css'

class Stars extends Component {
  constructor(props) {
    super()
    this.state = {
      rating: Number(props.rating),
      error: false,
      errorMessage: ''
    }
  }

  onRating(newRating) {
    let storage = JSON.parse(localStorage.getItem('programerskicitatiocene'))
    if(!storage) {
      vote(this.props.id, newRating)
        .then(res => {
          if(res === 'OK') {
            let storageData = [
                this.props.id
            ]
            localStorage.setItem('programerskicitatiocene', JSON.stringify(storageData))
            this.setState({ rating: newRating})
          } else {
            this.setState({ 
              error: true,
              errorMessage: 'Greska prilikom glasanja, pokusajte ponovo kasnije!'
            })
          }
      })
    } else if(Array.isArray(storage) && storage.indexOf(this.props.id) < 0) {
        vote(this.props.id, newRating)
          .then(res => {
            if(res === 'OK') {
              let storageData = [
                  ...storage,
                  this.props.id
              ]
              localStorage.setItem('programerskicitatiocene', JSON.stringify(storageData))
              this.setState({ rating: newRating})
          }
      })
    } else {
      this.setState({
          rating: Number(this.state.rating),
          error: true,
          errorMessage: 'You can vote just once!'
      })
    }
}

render(){
  return(
    <div>
      <ReactStars size={20} value={this.state.rating} onChange={this.onRating.bind(this)}/>
      {this.state.error && <p className="voting-error">{this.state.errorMessage}</p>}
    </div>
  )
}
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     edit: true,
  //     rated: false,
  //     rating: Number(this.props.rating)
  //   }
  // }

  // rate = newRating => {
  //   if (this.state.rated) return
  //   const http = new XMLHttpRequest()
  //   http.open('POST', 'https://baza-podataka.herokuapp.com/oceni-citat/')
  //   http.setRequestHeader('Content-type', 'application/json')
  //   http.onload = () => this.setState({ rating: Number(http.responseText) })
  //   http.send(JSON.stringify({ '_id': this.props.id, 'novaOcena': newRating }))
  //   this.setState({
  //     edit: false,
  //     rated: true
  //   })
  // }

  // render() {
  //   return (
  //     <ReactStars size={20} value={this.state.rating} onChange={this.rate} edit={this.state.edit} />
  //   )
  // }
}

export default Stars
