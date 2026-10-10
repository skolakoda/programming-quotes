import React from 'react'

import AuthorImage from './AuthorImage'
import Quote from './Quote'

export default function ImageQuote({quote}) {
  return (
    <div className="quote-box">
      <AuthorImage author={quote.author} />
      <Quote quote={quote} cssClass="big-quote" />
    </div>
  )
}
