import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'

import {useTranslate} from '../store/actions'
import EditForm from '../components/main/EditForm'
import preloader from '../assets/images/preloader.gif'
import {API} from '../config/api'

const EditQuote = ({ match }) => {
  const { id } = match.params
  const {admin, allQuotes} = useSelector(state => state)
  const translate = useTranslate()

  const [loading, setLoading] = useState(false)
  const [quote, setQuote] = useState(allQuotes.find(q => q._id === id))

  useEffect(() => {
    if (quote) return
    setLoading(true)
    fetch(`${API.read}/id/${id}`)
      .then(res => res.json())
      .then(quote => {
        setLoading(false)
        setQuote(quote)
      })
  }, [id, quote])

  if (loading) return <img src={preloader} alt="loading..." />
  if (!admin) return <p>{translate('ADMIN_REQUIRED')}</p>

  return <EditForm quote={quote} />
}

export default EditQuote
