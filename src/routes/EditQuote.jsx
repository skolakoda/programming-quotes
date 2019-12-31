import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import {connect, useDispatch} from 'react-redux'

import {addQuote, updateQuote, useTranslate} from '../store/actions'
import MessagePopup from '../components/main/MessagePopup'
import {API} from '../config/api'
import './EditQuote'

const EditQuote = ({ match, token, admin }) => {
  const dispatch = useDispatch()
  const translate = useTranslate()
  const [validation, setValidation] = useState('')
  const [response, setResponse] = useState('')
  const [quote, setQuote] = useState({})

  useEffect(() => {
    const { id } = match.params
    if (!id) return
    fetch(`${API.read}/id/${id}`)
      .then(res => res.json())
      .then(quote => setQuote(quote))
  }, [match.params])

  const emptyFields = fields => {
    [...fields].forEach(field => {field.value = ''})
  }

  const postQuote = e => {
    e.persist() // react fix
    e.preventDefault()
    setValidation('')
    const fields = e.target.elements
    const author = fields.author.value.trim(),
      sr = fields.sr.value.trim(),
      ms = fields.ms.value.trim(),
      source = fields.source.value.trim(),
      wiki = fields.wiki.value.trim(),
      tags = fields.tags.value.trim(),
      _id = fields._id.value.trim()
    const condition = author && sr
    if (!condition) return setValidation(translate('REQUIRED_FIELDS'))

    const endpoint = _id ? API.update : API.create
    const method = _id ? 'PUT' : 'POST'
    fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, sr, ms, source, wiki, tags, _id, token })
    })
      .then(res => res.json())
      .then(res => {
        setResponse(translate(res.message))
        if (res.message !== 'SUCCESS_SAVED') return
        if (_id)
          dispatch(updateQuote(res.quote))
        else {
          emptyFields(fields)
          dispatch(addQuote(res.quote))
          setQuote(res.quote)
        }
      })
      .catch(err => setResponse(translate('NETWORK_PROBLEM')))
  }

  const closePopup = () => {
    setResponse('')
  }

  if (!admin) return <p>{translate('ADMIN_REQUIRED')}</p>
  const quoteLink = `/quote/${quote.id}`

  return (
    <div>
      <h1>
        {translate(quote.id ? 'EDIT_QUOTE' : 'ADD_QUOTE')}
        {quote.id && <small><sup>(<Link to={quoteLink}>show</Link>)</sup></small>}
      </h1>

      <form onSubmit={postQuote}>
        <input type="hidden" name="_id" defaultValue={quote._id} />
        <p>
          <label htmlFor="author" title={translate('AUTHOR_TIP')}>{translate('AUTHOR')} *</label><br/>
          <input name="author" id="author" defaultValue={quote.author} autoFocus />
        </p>
        <p>
          <label htmlFor="sr" >Tekst ({translate('SERBOCROATIAN')}) *</label><br />
          <textarea name="sr" id="sr" defaultValue={quote.sr} cols="60" rows="5"></textarea>
        </p>
        <p>
          <label htmlFor="ms" >Tekst ({translate('INTERSLAVIC')}) </label><br />
          <textarea name="ms" id="ms" defaultValue={quote.ms} cols="60" rows="5"></textarea>
        </p>
        <p>
          <label htmlFor="source">{translate('SOURCE')} </label><br/>
          <input name='source' id='source' defaultValue={quote.source} />
        </p>
        <p>
          <label htmlFor="tags">{translate('TAGS')} </label><br/>
          <input name='tags' id='tags' defaultValue={quote.tags} />
        </p>
        <p>
          <label htmlFor="wiki">Wiki </label><br/>
          <input name='wiki' id='wiki' defaultValue={quote.wiki} />
        </p>
        {validation && <p className="red">{validation}</p>}
        <button type="submit">{translate('POST')}</button>
      </form>

      {response && <MessagePopup message={response} closePopup={closePopup} />}
    </div>
  )
}

const mapStateToProps = ({ token, admin, lang }) => ({ token, admin, lang })

export default connect(mapStateToProps)(EditQuote)
