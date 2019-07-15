import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {addQuote, updateQuote} from '../store/actions'
import translate from '../shared/translate'
import MessagePopup from '../components/main/MessagePopup'
import {API} from '../config/api'
import './EditQuote'

class EditQuote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      validation: '',
      response: ''
    }
  }

  emptyFields = fields => {
    [...fields].forEach(field => field.value = '')
  }

  postQuote = e => {
    e.persist() // react fix
    e.preventDefault()
    this.setState({ validation: '' })
    const fields = e.target.elements
    const author = fields.author.value.trim(),
      en = fields.en.value.trim(),
      sr = fields.sr.value.trim(),
      source = fields.source.value.trim(),
      _id = fields._id.value.trim()
    const condition = author && (sr || en)
    if (!condition) return this.setState({ validation: translate('REQUIRED_FIELDS') })

    const endpoint = _id ? API.update : API.create
    const method = _id ? 'PUT' : 'POST'
    fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, sr, en, source, _id, token: this.props.token })
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ response: translate(res.message) })
        if (res.message !== 'SUCCESS_SAVED') return
        this.emptyFields(fields)
        if (_id) this.props.updateQuote(res.quote)
        else this.props.addQuote(res.quote)
      })
      .catch(err => this.setState({ response: translate('NETWORK_PROBLEM') }))
  }

  closePopup = () => {
    this.setState({ response: '' })
  }

  render() {
    const edit = (this.props.match.path === '/edit-quote/:id')
    const id = edit ? this.props.match.params.id : ''
    const quote = edit ? this.props.allQuotes.find(q => q._id === id) : {}
    const quoteLink = `/quote/${id}`

    if (!this.props.admin) return <p>{translate('ADMIN_REQUIRED')}</p>

    return (
      <div>
        <h1>
          {translate(edit ? 'EDIT_QUOTE' : 'ADD_QUOTE')}
          {edit && <small><sup>(<Link to={quoteLink}>show</Link>)</sup></small>}
        </h1>

        <form onSubmit={this.postQuote}>
          <input type="hidden" name="_id" defaultValue={quote && quote._id} />
          <p>
            <label htmlFor="author" >{translate('AUTHOR')} <small>({translate('AUTHOR_TIP')})</small> </label><br/>
            <input name="author" defaultValue={quote && quote.author} autoFocus />
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
            <label>{translate('SOURCE')} <small>({translate('OPTIONAL')})</small>: </label><br/>
            <input name='source' defaultValue={quote && quote.source} />
          </p>
          <p>
            <small>* {translate('REQUIRED_FIELDS')}</small>
          </p>

          {this.state.validation && <p>{this.state.validation}</p>}
          <button type="submit">{translate('POST')}</button>
        </form>

        {this.state.response && <MessagePopup message={this.state.response} closePopup={this.closePopup} />}
      </div>
    )
  }
}

const mapStateToProps = ({allQuotes, token, admin}) => ({allQuotes, token, admin})
const mapDispatchToProps = {addQuote, updateQuote}

export default connect(mapStateToProps, mapDispatchToProps)(EditQuote)
