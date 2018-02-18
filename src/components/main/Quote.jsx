import React from 'react'
import {Link} from 'react-router-dom'
import Stars from './Stars'
import './Quote.css'

const Quote = ({author, content, rating, id}) => {
  const wikiUrl = `https://en.wikipedia.org/wiki/${author}`
  const link = `/edit-quote/${id}`
  return (
    <blockquote>
      <i>{content}</i> <Link to={link}><span className="edit-icon">&#9998;</span></Link><br/>
      <small> — <a href={wikiUrl} target="_blank">{author}</a> </small>
      <Stars rating={rating} id={id} />
    </blockquote>
  )
}

export default Quote
