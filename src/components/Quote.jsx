import React from 'react';

const Quote = props => {
  const wikiUrl = `https://en.wikipedia.org/wiki/${props.autor}`
  return (
    <blockquote>
      <i>{props.tekst}</i><br/>
      <small> — <a href={wikiUrl} target="_blank">{props.autor}</a> </small>
      {/* <img src={props.slika} /> */}
    </blockquote>
  )
}

export default Quote
