import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'

import {API} from '../config/api'
import ImageQuote from './../components/main/ImageQuote'
import './ShowQuote.css'

const ShowQuote = ({match}) => {
  const {id} = match.params
  const {allQuotes} = useSelector(state => state)
  const [quote, setQuote] = useState(allQuotes.find(q => q._id === id))

  useEffect(() => {
    if (quote) return
    fetch(`${API.read}/id/${id}`)
      .then(res => res.json())
      .then(quote => setQuote(quote))
  }, [id, quote])

  return (
    <ImageQuote quote={quote} cssClass="big-quote" />
  )
}

export default ShowQuote