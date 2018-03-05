import React, { Component } from 'react'
import ImageQuote from './../components/main/ImageQuote'

export default class RandomQuote extends Component {
  constructor() {
    super()
    this.state = {quote: null}
  }

  componentDidMount() {
    this.getRandom()
  }

  componentWillReceiveProps(nextProps) {
    this.getRandom()
  }

  getRandom = () => {
    const allQuotes = this.props.allQuotes
    this.setState({ quote: allQuotes[Math.floor(Math.random() * allQuotes.length)] })
  }

  render() {
    const { language, password } = this.props
    if (!this.state.quote || !this.state.quote[language]) return null

    return (
      <main>
        <h1>Quote of the day</h1>
        <ImageQuote quote={this.state.quote} allImages={this.props.allImages} language={language} password={password} cssClass="big-quote" />
        <button onClick={this.getRandom}>Gimme more!</button>
      </main>
    )
  }
}
