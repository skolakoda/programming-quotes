import React, {Component} from 'react'
import AuthorImage from './AuthorImage'
import Quote from './Quote'

export default class SingleQuote extends Component {
  render() {
    const { quote, language, allImages, password } = this.props

    return (
      <div className="quote-box">
        <AuthorImage author={quote.autor} allImages={allImages} />
        <Quote language={language} quote={quote} password={password} cssClass="big-quote" />
      </div>
    )
  }
}
