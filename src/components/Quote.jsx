import React from 'react';

const Quote = props => {
  return (
    <blockquote>
      <i>{props.tekst}</i><br/>
      <small> — {props.autor} </small>
    </blockquote>
  )
}

export default Quote
