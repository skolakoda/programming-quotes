import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import MessagePopup from './MessagePopup'
import {API} from '../../config/api'
import {deleteQuote, useTranslate, useTransliterate, useAuthorName} from '../../store/actions'
import './Quote.css'

const Quote = ({ quote, showSource, cssClass }) => {
  const {token, lang, admin} = useSelector(state => state)
  const dispatch = useDispatch()
  const translate = useTranslate()
  const transliterate = useTransliterate()
  const getName = useAuthorName()

  const [shouldDelete, setShouldDelete] = useState(false)
  const [response, setResponse] = useState('')
  const text = quote[lang]

  const {_id, author} = quote
  const authorLink = `/autor/${author.replace(/ /g, '_')}`
  const deleteCss = `pointer ${shouldDelete ? 'red' : ''}`

  const doDelete = () => {
    fetch(API.delete, {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({_id, token })
    })
      .then(response => response.text())
      .then(response => {
        setResponse(translate(response))
        if (response === 'QUOTE_DELETED') {
          dispatch(deleteQuote(_id))
          setShouldDelete(false)
        }
      })
  }

  const tryDelete = () => {
    if (shouldDelete) doDelete()
    setShouldDelete(true)
  }

  const closePopup = () => {
    setResponse('')
  }

  return (
    <blockquote className={cssClass || 'small-quote'}>
      <p className="quote-text">
        {text ? transliterate(text) : translate('NO_TRANSLATION')} &nbsp;
        <span className="icons">
          <Link to={`/citat/${_id}`} className="no-link">↠</Link>&nbsp;
          {admin &&
            <span>
              <Link to={`/edituj-citat/${_id}`}><span className="edit-icon">&#9998;</span></Link>&nbsp;
              <span onClick={tryDelete} className={deleteCss}>&#10005;</span>
            </span>
          }
        </span>
      </p>
      <span className="quote-author"> — <Link to={authorLink}>{getName(author)}</Link></span>

      {showSource && quote.source &&
        <p className="more-info">
          <small>{translate('SOURCE')}: </small>
          <small className="source-value">{quote.source}</small>
        </p>
      }

      {showSource && quote.wiki &&
        <p className="more-info">
          <small><a href={quote.wiki} target="_blank" rel="noopener noreferrer">wiki</a></small>
        </p>
      }

      {response && <MessagePopup message={response} closePopup={closePopup} />}
    </blockquote>
  )
}

export default Quote
