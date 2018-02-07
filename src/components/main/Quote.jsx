import React from 'react';
import Stars from './Stars'

const Quote = props => {
  const wikiUrl = `https://en.wikipedia.org/wiki/${props.author}`
  return (
    <blockquote>
      <i>{props.content}</i><br/>
      <small> — <a href={wikiUrl} target="_blank">{props.author}</a> </small>
      <Stars rating={props.rating} id={props.id} />
    </blockquote>
  )
}

export default Quote
