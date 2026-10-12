import React, {useEffect, useRef, useState} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import Stars from './Stars'
import MessagePopup from './MessagePopup'
import translate from '../../shared/translate'
import {displayName} from '../../shared/helpers'
import {API, useServerData} from '../../config/api'
import {deleteQuote} from '../../store/actions'
import './Quote.css'

function Quote({quote, language, admin, cssClass, token, deleteQuote}) {
  const [shouldDelete, setShouldDelete] = useState(false)
  const [response, setResponse] = useState('')
  const requestId = useRef(0)
  useEffect(() => () => { requestId.current++ }, [quote._id])

  const tryDelete = () => {
    if (shouldDelete) deleteCurrentQuote()
    setShouldDelete(true)
  }

  const deleteCurrentQuote = () => {
    if (!useServerData) return
    const _id = quote._id
    const currentRequest = ++requestId.current
    fetch(API.delete, {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({_id, token})
    })
      .then(response => response.text())
      .then(message => {
        if (currentRequest === requestId.current) setResponse(translate(message))
        if (message === 'QUOTE_DELETED') deleteQuote(_id)
      })
      .catch(() => {
        if (currentRequest === requestId.current) setResponse(translate('NETWORK_PROBLEM'))
      })
  }

  const closePopup = () => setResponse('')

  const author = quote.author
  const id = quote._id
  const authorLink = `/author/${author.replace(/ /g, '_')}`
  const deleteCss = `pointer ${shouldDelete ? 'red' : ''}`

  return quote[language] ? (
    <blockquote className={cssClass || 'small-quote'}>
      <p className="quote-text">
        <Link to={`/quote/${id}`} className="no-link">{quote[language]}</Link>&nbsp;
        { useServerData && admin &&
          <span className="admin-actions">
            <Link to={`/edit-quote/${id}`}><span className="edit-icon">&#9998;</span></Link>&nbsp;
            <span onClick={tryDelete} className={deleteCss}>&#10005;</span>
          </span>
        }
      </p>
      <Stars rating={quote.rating} id={id} />
      <span className="quote-author"> — <Link to={authorLink}>{displayName(author)}</Link></span>

      {response && <MessagePopup message={response} closePopup={closePopup} />}
    </blockquote>
  ) : translate('NO_TRANSLATION')
}

const mapStateToProps = ({language, admin, token}) => ({language, admin, token})
const mapDispatchToProps = {deleteQuote}

export default connect(mapStateToProps, mapDispatchToProps)(Quote)
