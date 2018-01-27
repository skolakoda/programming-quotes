import React from 'react';
import Stars from './Stars'

const Quote = props => {
  const wikiUrl = `https://en.wikipedia.org/wiki/${props.autor}`
  return (
    <blockquote>
      <i>{props.tekst}</i><br/>
      <small> — <a href={wikiUrl} target="_blank">{props.autor}</a> </small>
      <Stars/>
    </blockquote>
  )
}

export default Quote
