import React, {useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'

import {addQuote, updateQuote, useTranslate} from '../../store/actions'
import MessagePopup from './MessagePopup'
import {API} from '../../config/api'

const EditForm = ({ quote }) => {
  const {token, devMode} = useSelector(state => state)
  const dispatch = useDispatch()
  const translate = useTranslate()
  const history = useHistory()

  const [validation, setValidation] = useState('')
  const [response, setResponse] = useState('')
  const [reuse, setReuse] = useState(devMode)

  const postQuote = e => {
    e.preventDefault()
    setValidation('')
    const obj = Object.values(e.target.elements)
      .filter(el => el.name)
      .reduce((acc, el) => ({...acc, [el.name]: el.value.trim()}), {})

    if (!obj.author || !obj.sr) return setValidation(translate('REQUIRED_FIELDS'))
    if (reuse) delete obj._id

    const endpoint = obj._id ? API.update : API.create
    const method = obj._id ? 'PUT' : 'POST'
    fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...obj, token })
    })
      .then(res => res.json())
      .then(res => {
        if (res.message !== 'SUCCESS_SAVED') return
        const action = obj._id ? updateQuote : addQuote
        dispatch(action(res.quote))
        history.push(`/citat/${res.quote._id}`)
      })
      .catch(err => {
        setResponse(translate('NETWORK_PROBLEM'))
        console.log(err)
      })
  }

  return (
    <div>
      <h1>
        {translate(quote ? 'EDIT_QUOTE' : 'ADD_QUOTE')}
        {quote && quote._id && <small><sup>(<Link to={`/citat/${quote._id}`}>show</Link>)</sup></small>}
      </h1>

      <p>should reuse:{' '}
        <label>
          <input
            type="radio"
            name="translation-mode"
            value="off"
            checked={!reuse}
            onChange={() => setReuse(false)}
          /> off
        </label>
        <label>
          <input
            type="radio"
            name="translation-mode"
            value="on"
            checked={reuse}
            onChange={() => setReuse(true)}
          /> on
        </label>
      </p>

      <form onSubmit={postQuote}>
        <input type="hidden" name="_id" defaultValue={quote && quote._id} />
        <p>
          <label htmlFor="author" title={translate('AUTHOR_TIP')}>{translate('AUTHOR')} *</label><br/>
          <input name="author" id="author" defaultValue={quote && quote.author} autoFocus />
        </p>
        <p>
          <label htmlFor="sr" >Tekst ({translate('SERBOCROATIAN')}) *</label><br />
          <textarea name="sr" id="sr" defaultValue={quote && quote.sr} cols="60" rows="5"></textarea>
        </p>
        <p>
          <label htmlFor="ms" >Tekst ({translate('INTERSLAVIC')}) </label><br />
          <textarea name="ms" id="ms" defaultValue={quote && quote.ms} cols="60" rows="5"></textarea>
        </p>
        <p>
          <label htmlFor="source">{translate('SOURCE')} </label><br/>
          <input name='source' id='source' defaultValue={quote && quote.source} />
        </p>
        <p>
          <label htmlFor="tags">{translate('TAGS')} </label><br/>
          <input name='tags' id='tags' defaultValue={quote && quote.tags} />
        </p>
        <p>
          <label htmlFor="wiki">Wiki </label><br/>
          <input name='wiki' id='wiki' defaultValue={quote && quote.wiki} />
        </p>
        {validation && <p className="red">{validation}</p>}
        <button type="submit">{translate('POST')}</button>
      </form>

      {response && <MessagePopup message={response} closePopup={() => setResponse('')} />}
    </div>
  )
}

export default EditForm
