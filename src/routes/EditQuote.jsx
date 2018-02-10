import React from 'react'

const EditQuote = ({match}) => {

  return (
    <div>
      <h1>Edit quote</h1>
      <h3>Id: {match.params.id}</h3>
    </div>
  )
}

export default EditQuote
