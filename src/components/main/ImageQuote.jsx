import React from 'react'

import AuthorImage from './AuthorImage'
import Quote from './Quote'

export default function ImageQuote({quote}) {
  return (
    <div className="quote-box">
      <div className="author-image-slot">
        <AuthorImage author={quote.author} showUnknown={true} />
      </div>
      <Quote quote={quote} cssClass="big-quote" showTags />
    </div>
  )
}
