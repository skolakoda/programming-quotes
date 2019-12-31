import React from 'react'
import { useSelector } from 'react-redux'

import AuthorThumb from './AuthorThumb'

const Authors = () => {
  const {allImages, filteredAuthors} = useSelector(state => state)

  return (
    <div className="authors">
      {filteredAuthors.map(author =>
        <AuthorThumb
          key={author}
          author={author}
          image={allImages.get(author)}
        />
      )}
    </div>
  )}

export default Authors
