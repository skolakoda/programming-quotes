import React, { useEffect, useState } from 'react'

import {API} from '../config/api'
import ImageQuote from './../components/main/ImageQuote'
import './ShowQuote.css'

const ShowQuote = ({match}) => {
  const [quote, setQuote] = useState(null)

  useEffect(() => {
    const { id } = match.params
    fetch(`${API.read}/id/${id}`)
      .then(res => res.json())
      .then(quote => setQuote(quote))
  }, [match.params])

  if (!quote) return null

  return (
    <ImageQuote quote={quote} cssClass="big-quote" />
  )
}

export default ShowQuote