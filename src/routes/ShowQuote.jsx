import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import { withRouter } from 'react-router'

import {API} from '../config/api'
import ImageQuote from './../components/main/ImageQuote'
import './ShowQuote.css'

const ShowQuote = ({match}) => {
  const {id} = match.params
  const {allQuotes} = useSelector(state => state)
  const [quote, setQuote] = useState(allQuotes.find(q => q._id === id))

  useEffect(() => {
    if (quote && quote.id === id) return
    fetch(`${API.read}/id/${id}`)
      .then(res => res.json())
      .then(quote => setQuote(quote))
  }, [id, quote])

  return (
    <ImageQuote quote={quote} showSource={true} cssClass="big-quote" />
  )
}

export default withRouter(ShowQuote)