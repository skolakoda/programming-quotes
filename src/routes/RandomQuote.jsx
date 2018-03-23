import React, { Component } from 'react'
import ImageQuote from './../components/main/ImageQuote'
import translate from './../shared/translate'

export default class RandomQuote extends Component {
  constructor() {
    super()
    this.state = {
      quote: null,
      found: false
    }
  }

  componentDidMount() {
    this.getRandom()
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.found) this.getRandom()
  }

  getRandom = () => {
    const allQuotes = this.props.allQuotes.filter(q => q[this.props.language])
    if (!allQuotes.length) return
    const quote = allQuotes[Math.floor(Math.random() * allQuotes.length)]
    this.setState({quote, found: true})
  }

  render() {
    const { language, token, admin } = this.props
    if (!this.state.quote) return null

    return (
      <main>
        <h1>{translate('QUOTE_OF_THE_DAY')}</h1>
        <ImageQuote quote={this.state.quote} allImages={this.props.allImages} language={language} token={token} admin={admin} cssClass="big-quote" />
        <button onClick={this.getRandom}>Gimme more!</button>
      </main>
    )
  }
}
