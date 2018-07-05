import React, {Component} from 'react'

import AuthorImage from './AuthorImage'
import Quote from './Quote'

export default class ImageQuote extends Component {
  render() {
    const {quote} = this.props

    return (
      <div className="quote-box">
        <AuthorImage author={quote.author} />
        <Quote quote={quote} cssClass="big-quote" />
      </div>
    )
  }
}
