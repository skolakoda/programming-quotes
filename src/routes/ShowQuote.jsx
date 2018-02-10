import React from 'react'

const ShowQuote = ({ match }) => {

  return (
    <div>
      <h1>Show quote</h1>
      <h3>Id: {match.params.id}</h3>
    </div>
  )
}

export default ShowQuote
