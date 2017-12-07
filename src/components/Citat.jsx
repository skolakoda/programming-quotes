import React from 'react';

const Citat = props => {
  return (
    <blockquote>
      <i>{props.tekst}</i><br/>
      <small> — {props.autor} </small>
    </blockquote>
  )
}

export default Citat
