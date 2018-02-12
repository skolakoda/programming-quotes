import React, { Component } from 'react'
import translate from '../shared/translate'
import MessagePopup from './MessagePopup'

// dodati izvor
// srediti formu na osnovu kicine grane
// ukloniti stanje

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

  resetState() {
    this.setState({
      autor: '',
      sr: '',
      en: '',
      error: ''
    })
  }

  createQuote(e) {
    e.preventDefault()
    const { autor, sr, en } = this.state
    const condition = autor && (sr || en)
    if (!condition) return this.setState({error: translate('ARGUMENTS_ERROR')})

    fetch('https://baza-podataka.herokuapp.com/dodaj-citat/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autor, sr, en })
    })
      .then(response => {
        this.resetState()
        this.setState({ popupMessage: translate('SUCCESS_SAVED') }) // uzeti u obzir povratnu poruku
        return response.text()
      })
      .catch(e => this.setState({
        popupMessage: translate('ERROR_POPUP')
      }))
      .then(response => console.log(response))
  }

  render() {
    return (
      <div>
        <form onSubmit={this.createQuote.bind(this)}>
          <label htmlFor="author" >{translate('AUTHOR')}</label>
          <input id="author" value={this.state.autor} type="text" onChange={e => this.setState({ autor: e.target.value })} />
          <br />

          <label htmlFor="sr" >{translate('QUOTE_SERBIAN')}</label>
          <textarea id="sr" value={this.state.sr} type="text" onChange={e => this.setState({ sr: e.target.value })} />
          <br />

          <label htmlFor="en" >{translate('QUOTE_ENGLISH')}</label>
          <textarea id="en" value={this.state.en} type="text" onChange={e => this.setState({ en: e.target.value })} />
          <br />

          {this.state.error && <p>{this.state.error}</p>}

          <input value={translate('SAVE')} type="submit" />
        </form>

        {this.state.popupMessage && <MessagePopup message={this.state.popupMessage} closePopup={() => this.setState({ popupMessage: '' })} />}
      </div>

    )
  }
}

export default AddQuote