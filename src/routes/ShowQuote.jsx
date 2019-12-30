import React, {Component} from 'react'
import {connect} from 'react-redux'

import ImageQuote from './../components/main/ImageQuote'
import './ShowQuote.css'

class ShowQuote extends Component {
  render() {
    const {id} = this.props.match.params
    const { allQuotes } = this.props
    const quote = allQuotes.find(q => q._id === id)
    if (!quote) return null

    return (
      <ImageQuote quote={quote} cssClass="big-quote" />
    )
  }
}

const mapStateToProps = ({allQuotes}) => ({allQuotes})

export default connect(mapStateToProps)(ShowQuote)
