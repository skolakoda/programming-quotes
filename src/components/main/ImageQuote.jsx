import React from 'react'

import AuthorImage from './AuthorImage'
import Quote from './Quote'

const ImageQuote = ({quote}) => {
  if (!quote) return null
  return (
    <div className="quote-box">
      <AuthorImage author={quote.author} />
      <Quote quote={quote} cssClass="big-quote" />
    </div>
  )
}

export default ImageQuote