import React, { Component } from 'react'
import translate from '../shared/translate'
import MessagePopup from './MessagePopup'

class AddQuote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      validationMessage: '',
      popupMessage: '',
      quote: {}
    }
  }

  postQuote = e => {
    e.preventDefault()
    const fields = e.target.elements
    const autor = fields.author.value.trim(),
      en = fields.en.value.trim(),
      sr = fields.sr.value.trim(),
      izvor = fields.izvor.value.trim(),
      _id = fields._id.value.trim()
    const condition = autor && (sr || en)
    if (!condition) return this.setState({ validationMessage: translate('ARGUMENTS_ERROR') })

    ;[...fields].map(field => field.value = '')

    const api = _id ? 'azuriraj' : 'dodaj'
    fetch(`https://baza-podataka.herokuapp.com/${api}-citat/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autor, sr, en, izvor, _id, password: this.props.password })
    })
      .then(response => response.text())
      .catch(e => this.setState({ popupMessage: translate('ERROR_POPUP') }))
      .then(response => this.setState({ validationMessage: '', popupMessage: translate(response) }))
  }

  closePopup = () => {
    this.setState({ popupMessage: '' })
    window.location.reload()
  }

  render() {
    const edit = (this.props.match.path === '/edit-quote/:id')
    const id = edit ? this.props.match.params.id : ''
    const quote = edit ? this.props.allQuotes.find(q => q._id === id) : null

    return (
      <div>
        <h1>Dodaj citat</h1>
        {this.props.password ?
          <form onSubmit={this.postQuote}>
            <input type="hidden" name="_id" defaultValue={quote && quote._id} />
            <p>
              <label htmlFor="author" >{translate('AUTHOR')} <small>(name from en.wikipedia)</small> </label><br/>
              <input name="author" defaultValue={quote && quote.autor} />
            </p>
            <p>
              <label htmlFor="sr" >{translate('QUOTE_SERBIAN')}</label><br />
              <textarea name="sr" defaultValue={quote && quote.sr} cols="60" rows="5"></textarea>
            </p>
            <p>
              <label htmlFor="en" >{translate('QUOTE_ENGLISH')}</label><br />
              <textarea name="en" defaultValue={quote && quote.en} cols="60" rows="5"></textarea>
            </p>
            <p>
              <label>Source (<small>optional</small>): </label><br/>
              <input name='izvor' defaultValue={quote && quote.izvor} />
            </p>
            <p>
              <small>* Author and at least one language is required.</small>
            </p>

            {this.state.validationMessage && <p>{this.state.validationMessage}</p>}
            <button type="submit">{translate('POST')}</button>
          </form>
          : <p>Moraš biti prijavljen</p>
        }
        {this.state.popupMessage && <MessagePopup message={this.state.popupMessage} closePopup={this.closePopup} />}
      </div>
    )
  }
}

export default AddQuote
