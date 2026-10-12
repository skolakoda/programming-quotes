import React from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import Stars from './Stars'
import {useTranslate} from '../../shared/translate'
import {displayName} from '../../shared/helpers'
import './Quote.css'

function Quote({quote, language, cssClass}) {
  const translate = useTranslate()
  const author = quote.author
  const id = quote._id
  const authorLink = `/author/${author.replace(/ /g, '_')}`

  return quote[language] ? (
    <blockquote className={cssClass || 'small-quote'}>
      <p className="quote-text">
        <Link to={`/quote/${id}`} className="no-link">{quote[language]}</Link>
      </p>
      <Stars rating={quote.rating} id={id} />
      <span className="quote-author"> — <Link to={authorLink}>{displayName(author)}</Link></span>
    </blockquote>
  ) : translate('NO_TRANSLATION')
}

const mapStateToProps = ({language}) => ({language})

export default connect(mapStateToProps)(Quote)
