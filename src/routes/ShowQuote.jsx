import React from 'react'
import {useParams} from 'react-router'
import {connect} from 'react-redux'

import ImageQuote from './../components/main/ImageQuote'
import './ShowQuote.css'

function ShowQuote({allQuotes}) {
  const {id} = useParams()
  const quote = allQuotes.find(q => q._id === id)
  if (!quote) return null

  return (
    <ImageQuote quote={quote} cssClass="big-quote" />
  )
}

const mapStateToProps = ({allQuotes}) => ({allQuotes})

export default connect(mapStateToProps)(ShowQuote)
