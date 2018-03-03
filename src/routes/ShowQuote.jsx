import React, {Component} from 'react'
import AuthorImage from '../components/main/AuthorImage'
import Quote from './../components/main/Quote'
import './ShowQuote.css'

export default class ShowQuote extends Component {
  render() {
    const id = this.props.match.params.id
    const { language, allQuotes, password } = this.props
    const quote = allQuotes.find(q => q._id === id)
    if (!quote || !quote[language]) return null

    return (
      <main className="quote-box">
        <AuthorImage author={quote.autor} authorImages={this.props.authorImages} />
        <Quote id={id} language={language} quotes={allQuotes} password={password} cssClass="big-quote" />
      </main>
    )
  }
}
