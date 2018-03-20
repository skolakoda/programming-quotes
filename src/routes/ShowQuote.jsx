import React, {Component} from 'react'
import ImageQuote from './../components/main/ImageQuote'
import './ShowQuote.css'

export default class ShowQuote extends Component {
  render() {
    const id = this.props.match.params.id
    const { language, allQuotes, token, admin } = this.props
    const quote = allQuotes.find(q => q._id === id)
    if (!quote) return null

    return (
      <ImageQuote quote={quote} allImages={this.props.allImages} language={language} token={token} admin={admin} cssClass="big-quote" />
    )
  }
}
