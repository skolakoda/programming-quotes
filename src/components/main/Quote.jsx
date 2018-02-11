import React from 'react'
import {Link} from 'react-router-dom'
import Stars from './Stars'
import './Quote.css'

const Quote = ({author, content, rating, id}) => {
  const wikiUrl = `https://en.wikipedia.org/wiki/${author}`
  return (
    <blockquote>
      <Link to={`/quote/${id}`} className='no-link'><i>{content}</i></Link> <Link to={`/edit-quote/${id}`} className='edit-icon no-link'>&#9998;</Link> <br/>
      <small> — <Link to={`/author/${author}`}>{author}</Link> (<small><a href={wikiUrl} target="_blank">wiki</a></small>) </small>
      <Stars rating={rating} id={id} />
    </blockquote>
  )
}

export default Quote
