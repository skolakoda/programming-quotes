import React from 'react';
import Stars from './Stars'

const Quote = ({author, content, rating, quoteId, onRate}) => {
  const wikiUrl = `https://en.wikipedia.org/wiki/${author}`
  return (
    <blockquote>
      <i>{content}</i><br/>
      <small> — <a href={wikiUrl} target="_blank">{author}</a> </small>
      <Stars rating={rating} quoteId={quoteId}/>
    </blockquote>
  )
}

export default Quote
