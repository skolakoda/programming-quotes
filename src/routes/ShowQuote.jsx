import React from 'react'

const ShowQuote = ({ match }) => {

  return (
    <main>
      <h1>Show quote</h1>
      <h3>Id: {match.params.id}</h3>
    </main>
  )
}

export default ShowQuote
