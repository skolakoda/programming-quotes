import React, { Component } from 'react'
import Quote from './../components/main/Quote'

export default class RandomQuote extends Component {
  constructor() {
    super()
    this.state = {quote: null}
  }

  componentWillReceiveProps(nextProps) {
    const allQuotes = nextProps.allQuotes
    this.setState({ quote: allQuotes[Math.floor(Math.random() * allQuotes.length)] })
  }

  render() {
    const { language, password } = this.props
    if (!this.state.quote || !this.state.quote[language]) return null

    return (
      <main>
        <h1>Quote of the day</h1>
        <Quote language={language} quote={this.state.quote} id={this.state.quote._id} password={password} cssClass="big-quote" />
      </main>
    )
  }
}