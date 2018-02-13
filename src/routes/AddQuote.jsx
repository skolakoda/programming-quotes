import React, { Component } from 'react'
import translate from '../shared/translate'
import MessagePopup from './MessagePopup'

class AddQuote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: '',
      popupMessage: ''
    }
  }

  postQuote = e => {
    e.preventDefault()
    const fields = e.target.elements
    const autor = fields.author.value,
      en = fields.en.value,
      sr = fields.sr.value,
      izvor = fields.izvor.value
    const condition = autor && (sr || en)
    if (!condition) return this.setState({ error: translate('ARGUMENTS_ERROR') })
    ;[...fields].map(field => field.value = '')

    fetch('https://baza-podataka.herokuapp.com/dodaj-citat/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autor, sr, en, izvor })
    })
      .then(response => response.text())
      .catch(e => this.setState({ popupMessage: translate('ERROR_POPUP') }))
      .then(response => this.setState({ error: '', popupMessage: response }))
      // prevoditi response sa servera tj. prikazivati translate('SUCCESS_SAVED') uslovno
  }

  closePopup = () => {
    this.setState({ popupMessage: '' })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.postQuote}>
          <p>
            <label htmlFor="author" >{translate('AUTHOR')} <small>(like on en.wikipedia)</small> </label><br/>
            <input name="author" />
          </p>

          <p>
            <label htmlFor="sr" >{translate('QUOTE_SERBIAN')}</label><br />
            <textarea name="sr" cols="60" rows="5" onChange={this.handleInput}></textarea>
          </p>

          <p>
            <label htmlFor="en" >{translate('QUOTE_ENGLISH')}</label><br />
            <textarea name="en" cols="60" rows="5" onChange={this.handleInput}></textarea>
          </p>

          <p>
            <label>Source (<small>optional</small>): </label><br/>
            <input name='izvor' />
          </p>

          <p>
            <small>* Author and at least one language is required.</small>
          </p>

          {this.state.error && <p>{this.state.error}</p>}

          <button type="submit">{translate('SAVE')}</button>
        </form>

        {this.state.popupMessage && <MessagePopup message={this.state.popupMessage} closePopup={this.closePopup} />}
      </div>
    )
  }
}

export default AddQuote
