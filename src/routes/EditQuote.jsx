import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'

import {addQuote, updateQuote, useTranslate} from '../store/actions'
import MessagePopup from '../components/main/MessagePopup'
import preloader from '../assets/images/preloader.gif'
import {API} from '../config/api'
import './EditQuote'

const EditQuote = ({ match }) => {
  const { id } = match.params
  const {token, admin, allQuotes} = useSelector(state => state)
  const dispatch = useDispatch()
  const translate = useTranslate()
  const [validation, setValidation] = useState('')
  const [response, setResponse] = useState('')
  const [quote, setQuote] = useState(allQuotes.find(q => q._id === id))

  useEffect(() => {
    if (quote) return
    fetch(`${API.read}/id/${id}`)
      .then(res => res.json())
      .then(quote => setQuote(quote))
  }, [id, quote])

  const emptyFields = fields => {
    [...fields].forEach(field => {field.value = ''})
  }

  // TODO: move to actions
  const postQuote = e => {
    e.preventDefault()
    setValidation('')
    const obj = Object.values(e.target.elements)
      .filter(el => el.name)
      .reduce((acc, el) => ({...acc, [el.name]: el.value.trim()}), {})

    if (!obj.author || !obj.sr) return setValidation(translate('REQUIRED_FIELDS'))

    const endpoint = obj._id ? API.update : API.create
    const method = obj._id ? 'PUT' : 'POST'
    fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...obj, token })
    })
      .then(res => res.json())
      .then(res => {
        setResponse(translate(res.message))
        if (res.message !== 'SUCCESS_SAVED') return
        if (obj._id)
          dispatch(updateQuote(res.quote))
        else {
          emptyFields(e.target.elements)
          dispatch(addQuote(res.quote))
          setQuote(res.quote)
        }
      })
      .catch(err => setResponse(translate('NETWORK_PROBLEM')))
  }

  if (!quote) return <img src={preloader} alt="loading..." />
  if (!admin) return <p>{translate('ADMIN_REQUIRED')}</p>

  return (
    <div>
      <h1>
        {translate(quote._id ? 'EDIT_QUOTE' : 'ADD_QUOTE')}
        {quote._id && <small><sup>(<Link to={`/quote/${quote._id}`}>show</Link>)</sup></small>}
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

      {response && <MessagePopup message={response} closePopup={() => setResponse('')} />}
    </div>
  )
}

export default EditQuote
