import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import translate from '../shared/translate'
import MessagePopup from '../components/main/MessagePopup'
import {API} from '../config/api'
import './EditQuote'

class EditQuote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      warning: '',
      response: ''
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
    if (!condition) return this.setState({ warning: translate('REQUIRED_FIELDS') })

    ;[...fields].map(field => field.value = '')

    const endpoint = _id ? API.update : API.create
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autor, sr, en, izvor, _id, password: this.props.password })
    })
      .then(res => res.text())
      .catch(e => this.setState({ response: translate('ERROR_POPUP') }))
      .then(res => this.setState({ warning: '', response: translate(res) }))
  }

  closePopup = () => {
    this.setState({ response: '' })
    window.location.reload() // TODO: push new quote into allQuotes
  }

  render() {
    const edit = (this.props.match.path === '/edit-quote/:id')
    const id = edit ? this.props.match.params.id : ''
    const quote = edit ? this.props.allQuotes.find(q => q._id === id) : null
    const quoteLink = `/quote/${id}`

    if (!this.props.password) return <p>{translate('LOGIN_REQUIRED')}</p>

    return (
      <div>
        <h1>{translate(edit ? 'EDIT_QUOTE' : 'ADD_QUOTE')} {edit && <small><sup>(<Link to={quoteLink}>show</Link>)</sup></small>}</h1>

        <form onSubmit={this.postQuote}>
          <input type="hidden" name="_id" defaultValue={quote && quote._id} />
          <p>
            <label htmlFor="author" >{translate('AUTHOR')} <small>({translate('AUTHOR_TIP')})</small> </label><br/>
            <input name="author" defaultValue={quote && quote.autor} autoFocus />
          </p>
          <p>
            <label htmlFor="en" >{translate('QUOTE_ENGLISH')}</label><br />
            <textarea name="en" defaultValue={quote && quote.en} cols="60" rows="5"></textarea>
          </p>
          <p>
            <label htmlFor="sr" >{translate('QUOTE_SERBIAN')}</label><br />
            <textarea name="sr" defaultValue={quote && quote.sr} cols="60" rows="5"></textarea>
          </p>
          <p>
            <label>{translate('SOURCE')} <small>({translate('OPTIONAL')})</small>: </label><br/>
            <input name='izvor' defaultValue={quote && quote.izvor} />
          </p>
          <p>
            <small>* {translate('REQUIRED_FIELDS')}</small>
          </p>

          {this.state.warning && <p>{this.state.warning}</p>}
          <button type="submit">{translate('POST')}</button>
        </form>

        {this.state.response && <MessagePopup message={this.state.response} closePopup={this.closePopup} />}
      </div>
    )
  }
}

export default EditQuote
