import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {connect, useDispatch} from 'react-redux'

import MessagePopup from './MessagePopup'
import translate from '../../shared/translate'
import {API} from '../../config/api'
import {deleteQuote} from '../../store/actions'
import './Quote.css'

const Quote = ({ quote, token, language, admin, cssClass }) => {
  const dispatch = useDispatch()
  const [shouldDelete, setShouldDelete] = useState(false)
  const [response, setResponse] = useState('')

  if (!quote[language]) return translate('NO_TRANSLATION')

  const {_id, author} = quote
  const authorLink = `/author/${author.replace(/ /g, '_')}`
  const deleteCss = `pointer ${shouldDelete ? 'red' : ''}`

  const doDelete = () => {
    fetch(API.delete, {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({_id, token })
    })
      .then(response => response.text())
      .then(response => {
        setResponse(translate(response)) // ne otvara popup
        if (response === 'QUOTE_DELETED') dispatch(deleteQuote(_id))
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
        {quote[language]} &nbsp;
        <span className="icons">
          <Link to={`/quote/${_id}`} className="no-link">↠</Link>&nbsp;
          {admin &&
            <span>
              <Link to={`/edit-quote/${_id}`}><span className="edit-icon">&#9998;</span></Link>&nbsp;
              <span onClick={tryDelete} className={deleteCss}>&#10005;</span>
            </span>
          }
        </span>
      </p>
      <span className="quote-author"> — <Link to={authorLink}>{author}</Link></span>

      {response && <MessagePopup message={response} closePopup={closePopup} />}
    </blockquote>
  )
}

const mapStateToProps = ({language, admin, token}) => ({language, admin, token})

export default connect(mapStateToProps)(Quote)
