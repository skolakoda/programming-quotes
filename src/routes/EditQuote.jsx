import React, {useEffect, useRef, useState} from 'react'
import {Link, useParams} from 'react-router'
import {connect} from 'react-redux'

import {addQuote, updateQuote} from '../store/actions'
import translate from '../shared/translate'
import MessagePopup from '../components/main/MessagePopup'
import {API, useServerData} from '../config/api'

function EditQuote({id = '', allQuotes, token, admin, addQuote, updateQuote}) {
  const [validation, setValidation] = useState('')
  const [response, setResponse] = useState('')
  const requestId = useRef(0)
  useEffect(() => () => { requestId.current++ }, [])

  const emptyFields = fields => {
    [...fields].forEach(field => field.value = '')
  }

  const postQuote = e => {
    e.preventDefault()
    if (!useServerData) return
    setValidation('')
    const fields = e.currentTarget.elements
    const author = fields.author.value.trim(),
      en = fields.en.value.trim(),
      sr = fields.sr.value.trim(),
      source = fields.source.value.trim(),
      _id = fields._id.value.trim()
    const condition = author && (sr || en)
    if (!condition) return setValidation(translate('REQUIRED_FIELDS'))

    const endpoint = _id ? API.update : API.create
    const method = _id ? 'PUT' : 'POST'
    const currentRequest = ++requestId.current
    fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, sr, en, source, _id, token })
    })
      .then(res => res.json())
      .then(res => {
        if (currentRequest === requestId.current) setResponse(translate(res.message))
        if (res.message !== 'SUCCESS_SAVED') return
        if (currentRequest === requestId.current) emptyFields(fields)
        if (_id) updateQuote(res.quote)
        else addQuote(res.quote)
      })
      .catch(() => {
        if (currentRequest === requestId.current) setResponse(translate('NETWORK_PROBLEM'))
      })
  }

  const closePopup = () => setResponse('')

  const edit = Boolean(id)
  const quote = edit ? allQuotes.find(q => q._id === id) : {}
  const quoteLink = `/quote/${id}`

  if (!admin) return <p>{translate('ADMIN_REQUIRED')}</p>

  return (
    <div>
      <h1>
        {translate(edit ? 'EDIT_QUOTE' : 'ADD_QUOTE')}
        {edit && <small><sup>(<Link to={quoteLink}>show</Link>)</sup></small>}
      </h1>

      <form onSubmit={postQuote}>
        <input type="hidden" name="_id" defaultValue={quote && quote._id} />
        <p>
          <label htmlFor="author" >{translate('AUTHOR')} <small>({translate('AUTHOR_TIP')})</small> </label><br/>
          <input name="author" defaultValue={quote && quote.author} autoFocus />
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
          <input name='source' defaultValue={quote && quote.source} />
        </p>
        <p>
          <small>* {translate('REQUIRED_FIELDS')}</small>
        </p>

        {validation && <p>{validation}</p>}
        <button type="submit">{translate('POST')}</button>
      </form>

      {response && <MessagePopup message={response} closePopup={closePopup} />}
    </div>
  )
}

const mapStateToProps = ({allQuotes, token, admin}) => ({allQuotes, token, admin})
const mapDispatchToProps = {addQuote, updateQuote}

const ConnectedEditQuote = connect(mapStateToProps, mapDispatchToProps)(EditQuote)

export default function EditQuoteRoute() {
  const {id} = useParams()
  return <ConnectedEditQuote key={id || 'new'} id={id} />
}
