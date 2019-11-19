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
      response: '',
      quote: {}
    }
  }

  componentDidMount() {
    const {id} = this.props.match.params
    if (!id) return
    fetch(`${API.read}/id/${id}`)
      .then(res => res.json())
      .then(quote => this.setState({quote}))
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
      sr = fields.sr.value.trim(),
      ms = fields.ms.value.trim(),
      source = fields.source.value.trim(),
      wiki = fields.wiki.value.trim(),
      tags = fields.tags.value.trim(),
      _id = fields._id.value.trim()
    const condition = author && sr
    if (!condition) return this.setState({ validation: translate('REQUIRED_FIELDS') })

    const endpoint = _id ? API.update : API.create
    const method = _id ? 'PUT' : 'POST'
    fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, sr, ms, source, wiki, tags, _id, token: this.props.token })
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ response: translate(res.message) })
        if (res.message !== 'SUCCESS_SAVED') return
        if (_id) {
          this.props.updateQuote(res.quote)
        } else {
          this.emptyFields(fields)
          this.props.addQuote(res.quote)
          this.setState({quote: res.quote})
        }
      })
      .catch(err => this.setState({ response: translate('NETWORK_PROBLEM') }))
  }

  closePopup = () => {
    this.setState({ response: '' })
  }

  render() {
    if (!this.props.admin) return <p>{translate('ADMIN_REQUIRED')}</p>

    const {id} = this.props.match.params || this.state.quote
    const quote = id ? this.state.quote : {}
    const quoteLink = `/quote/${id}`

    return (
      <div>
        <h1>
          {translate(id ? 'EDIT_QUOTE' : 'ADD_QUOTE')}
          {id && <small><sup>(<Link to={quoteLink}>show</Link>)</sup></small>}
        </h1>

        <form onSubmit={this.postQuote}>
          <input type="hidden" name="_id" defaultValue={quote._id} />
          <p>
            <label htmlFor="author" title={translate('AUTHOR_TIP')}>{translate('AUTHOR')} *</label><br/>
            <input name="author" id="author" defaultValue={quote.author} size="70" autoFocus />
          </p>
          <p>
            <label htmlFor="sr" >Tekst (srpski) *</label><br />
            <textarea name="sr" id="sr" defaultValue={quote.sr} cols="60" rows="5"></textarea>
          </p>
          <p>
            <label htmlFor="ms" >Tekst (medžuslovjansky) </label><br />
            <textarea name="ms" id="ms" defaultValue={quote.ms} cols="60" rows="5"></textarea>
          </p>
          <p>
            <label htmlFor="tags">Oznake </label><br/>
            <input name='tags' id='tags' defaultValue={quote.tags} size="70" />
          </p>
          <p>
            <label htmlFor="source">{translate('SOURCE')} </label><br/>
            <input name='source' id='source' defaultValue={quote.source} size="70" />
          </p>
          <p>
            <label htmlFor="wiki">Wiki </label><br/>
            <input name='wiki' id='wiki' defaultValue={quote.wiki} size="70" />
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
