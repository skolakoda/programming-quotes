import React from 'react'

const EditQuote = ({match}) => {

  return (
    <main>
      <h1>Edit quote</h1>
      <h3>Id: {match.params.id}</h3>
    </main>
  )
}

export default EditQuote
