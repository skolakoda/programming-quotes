import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'

import {API} from '../config/api'
import ImageQuote from './../components/main/ImageQuote'
import {useTranslate} from '../store/actions'
import preloader from '../assets/images/preloader.gif'
import './ShowQuote.css'

const ShowQuote = ({match}) => {
  const {id} = match.params
  const {allQuotes} = useSelector(state => state)
  const [quote, setQuote] = useState(allQuotes.find(q => q._id === id))
  const translate = useTranslate()

  useEffect(() => {
    if (quote && quote.id === id) return
    fetch(`${API.read}/id/${id}`)
      .then(res => res.json())
      .then(quote => setQuote(quote))
  }, [id, quote])

  if (!quote) return <img src={preloader} alt="loading..." />

  return (
    <main>
      <ImageQuote quote={quote} showSource={true} cssClass="big-quote" />
      <button><Link to="/" className="no-link" replace>{translate('MORE_WISDOM')}</Link></button>
    </main>
  )
}

export default ShowQuote
