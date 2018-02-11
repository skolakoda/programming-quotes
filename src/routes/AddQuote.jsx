import React, { Component } from 'react'
import translate from '../shared/translate'
import MessagePopup from './MessagePopup'
import axios from 'axios'

class AddQuote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      autor: '',
      sr: '',
      en: '',
      error: '',
      popupMessage: ''
    }
  }

  createQuote(e) {
    console.log('fire');
    e.preventDefault()
    let autor = this.state.autor
    let sr = this.state.sr
    let en = this.state.en
    if(autor && (sr || en)) {
      axios.post('https://baza-podataka.herokuapp.com/dodaj-citat/', {autor, sr, en})
        .then(res => this.setState({
          popupMessage: translate('SUCCESS_SAVED'),
          autor: '',
          sr: '',
          error: '',
          en: ''
        }))
        .catch(e => this.setState({
          popupMessage: translate('ERROR_POPUP')
        }))
    } else {
      this.setState({
        error: translate('ARGUMENTS_ERROR')
      })
    }
  }

  render() {
    return (
      <div>
      <form onSubmit={this.createQuote.bind(this)}>
        <label htmlFor="author" >{translate('AUTHOR')}</label>
        <input id="author" value={this.state.autor} type="text" onChange={(e) => this.setState({autor: e.target.value})} />
        <br /> 
        <label htmlFor="sr" >{translate('QUOTE_SERBIAN')}</label>
        <textarea id="sr" value={this.state.sr} type="text" onChange={(e) => this.setState({sr: e.target.value})} />
        <br />  
        <label htmlFor="en" >{translate('QUOTE_ENGLISH')}</label>
        <textarea id="en" value={this.state.en} type="text" onChange={(e) => this.setState({en: e.target.value})} />
        <br />
        {this.state.error && <p>{this.state.error}</p>}
        <input value={translate('SAVE')} type="submit" />
      </form>
      {this.state.popupMessage && <MessagePopup message={this.state.popupMessage} closePopup={() => this.setState({popupMessage: ''})} />}
      </div>
      
    )
  }
}

export default AddQuote
