import React from 'react'
import {useParams} from 'react-router'
import {connect} from 'react-redux'

import ImageQuote from './../components/main/ImageQuote'
import NotFound from './NotFound'
import {displayName} from '../shared/helpers'
import {usePageTitle} from '../shared/usePageTitle'
import './ShowQuote.css'

function QuotePage({quote}) {
  usePageTitle(displayName(quote.author))
  return <ImageQuote quote={quote} />
}

function ShowQuote({allQuotes}) {
  const {id} = useParams()
  const quote = allQuotes.find(q => q._id === id)
  return quote ? <QuotePage quote={quote} /> : <NotFound />
}

const mapStateToProps = ({allQuotes}) => ({allQuotes})

export default connect(mapStateToProps)(ShowQuote)
