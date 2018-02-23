import React from 'react'
import {Link} from 'react-router-dom'
import Stars from './Stars'
import './Quote.css'

const Quote = ({author, content, rating, id, password}) => {
  const quoteLink = `/quote/${id}`
  const editLink = `/edit-quote/${id}`
  const authorLink = `/author/${author}`
  const wikiUrl = `https://en.wikipedia.org/wiki/${author}`

  return (
    <blockquote>
      <Link to={quoteLink} className="no-link"><i>{content}</i></Link>&nbsp;
      { password && <Link to={editLink}><span className="edit-icon">&#9998;</span></Link> }
      <br/>
      <small> — <Link to={authorLink}>{author}</Link> <small>(<a href={wikiUrl} target="_blank">wiki</a>)</small> </small>
      <Stars rating={rating} id={id} />
    </blockquote>
  )
}

export default Quote
