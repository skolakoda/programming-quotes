import React from 'react'

const ShowAuthor = ({ match }) => {

  return (
    <div>
      <h1>Show Author</h1>
      <h3>Id: {match.params.id}</h3>
    </div>
  )
}

export default ShowAuthor
