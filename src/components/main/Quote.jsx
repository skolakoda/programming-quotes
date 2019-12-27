import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import MessagePopup from './MessagePopup'
import translate from '../../shared/translate'
import {API} from '../../config/api'
import {deleteQuote} from '../../store/actions'
import './Quote.css'

const Quote = (props) => {

  const [shouldDelete, setShouldDelete] = useState(false)
  const [response, setResponse] = useState('')

  const tryDelete = () => {
    if (shouldDelete) deleteQuote()
    setShouldDelete(true)
  }

  const deleteQuote = () => {
    const _id = props.quote._id
    fetch(API.delete, {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({_id, token: props.token})
    })
      .then(response => response.text())
      .then(response => {
        setResponse(translate(response)) // ne otvara popup
        if (response === 'QUOTE_DELETED') props.deleteQuote(_id)
      })
  }

  const closePopup = () => {
    setResponse('')
  }

  const { quote, language, admin, cssClass } = props
  const author = quote.author
  const id = quote._id
  const authorLink = `/author/${author.replace(/ /g, '_')}`
  const deleteCss = `pointer ${shouldDelete ? 'red' : ''}`

  return quote[language] ? (
    <blockquote className={cssClass || 'small-quote'}>
      <p className="quote-text">
        {quote[language]} &nbsp;
        <span className="icons">
          <Link to={`/quote/${id}`} className="no-link">↠</Link>&nbsp;
          {admin &&
            <span>
              <Link to={`/edit-quote/${id}`}><span className="edit-icon">&#9998;</span></Link>&nbsp;
              <span onClick={tryDelete} className={deleteCss}>&#10005;</span>
            </span>
          }
        </span>
      </p>
      <span className="quote-author"> — <Link to={authorLink}>{author}</Link></span>

      {response && <MessagePopup message={response} closePopup={closePopup} />}
    </blockquote>
  ) : translate('NO_TRANSLATION')
}

const mapStateToProps = ({language, admin, token}) => ({language, admin, token})
const mapDispatchToProps = {deleteQuote}

export default connect(mapStateToProps, mapDispatchToProps)(Quote)
