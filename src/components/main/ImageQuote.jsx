import React from 'react'

import AuthorImage from './AuthorImage'
import Quote from './Quote'

const ImageQuote = ({quote, showSource}) => {
  if (!quote) return null
  return (
    <div className="quote-box">
      <AuthorImage author={quote.author} />
      <Quote quote={quote} showSource={showSource} cssClass="big-quote" />
    </div>
  )
}

export default ImageQuote