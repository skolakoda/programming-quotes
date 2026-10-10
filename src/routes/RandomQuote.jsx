import React, { Component } from 'react'
import {connect} from 'react-redux'

import ImageQuote from './../components/main/ImageQuote'
import translate from './../shared/translate'

class RandomQuote extends Component {
  constructor() {
    super()
    this.state = {
      quote: null
    }
  }

  componentDidMount() {
    this.getRandom()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.language === this.props.language && prevProps.allQuotes === this.props.allQuotes) return

    const quote = this.props.allQuotes.find(q =>
      this.state.quote && q._id === this.state.quote._id && q[this.props.language]
    )
    if (quote) {
      if (quote !== this.state.quote) this.setState({quote})
    } else {
      this.getRandom()
    }
  }

  getRandom = () => {
    const allQuotes = this.props.allQuotes.filter(q => q[this.props.language])
    const quote = allQuotes.length ? allQuotes[Math.floor(Math.random() * allQuotes.length)] : null
    this.setState({quote})
  }

  render() {
    return (
      <main>
        <h1>{translate('QUOTE_OF_THE_DAY')}</h1>
        {this.state.quote
          ? <ImageQuote quote={this.state.quote} cssClass="big-quote" />
          : <p>{translate('NO_TRANSLATION')}</p>
        }
        <button onClick={this.getRandom} disabled={!this.state.quote}>Gimme more!</button>
      </main>
    )
  }
}

const mapStateToProps = ({allQuotes, language}) => ({allQuotes, language})

export default connect(mapStateToProps)(RandomQuote)
