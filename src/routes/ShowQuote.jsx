import React, {Component} from 'react'
import SingleQuote from './../components/main/SingleQuote'
import './ShowQuote.css'

export default class ShowQuote extends Component {
  render() {
    const id = this.props.match.params.id
    const { language, allQuotes, password } = this.props
    const quote = allQuotes.find(q => q._id === id)
    if (!quote || !quote[language]) return null

    return (
      <SingleQuote quote={quote} allImages={this.props.allImages} language={language} password={password} cssClass="big-quote" />
    )
  }
}
