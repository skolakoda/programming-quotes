import React, {Component} from 'react'
import AuthorImage from '../components/main/AuthorImage'
import Quote from './../components/main/Quote'
import translate from '../shared/translate'
import {API} from '../config/endpoints'
import './ShowQuote.css'

export default class ShowQuote extends Component {
  constructor() {
    super()
    this.state = {
      shouldDelete: false,
      response: ''
    }
  }

  tryDelete = () => {
    if (this.state.shouldDelete)
      this.deleteQuote()
    this.setState({shouldDelete: true})
  }

  deleteQuote = () => {
    fetch(API.del, {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({_id: this.props.match.params.id, password: this.props.password})
    })
      .then(response => response.text())
      .then(response => this.setState({response: translate(response)}))
  }

  closePopup = () => {
    this.setState({ response: '' })
    window.location.reload() // TODO: remove quote from allQuotes
  }

  render() {
    const id = this.props.match.params.id
    const { language, allQuotes, password } = this.props
    const quote = allQuotes.find(q => q._id === id)
    if (!quote || !quote[language]) return null

    return (
      <main className="quote-box">
        <AuthorImage author={quote.autor} authorImages={this.props.authorImages} />
        <Quote id={id} language={language} currentQuotes={allQuotes} password={password} cssClass="big-quote" />
      </main>
    )
  }
}
