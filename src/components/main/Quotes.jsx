import React, {useState} from 'react'
import {useSelector} from 'react-redux'

import Quote from './Quote'
import Pagionation from './Pagination'
import preloader from '../../assets/images/preloader.gif'
import {useTranslate, useTransliterate} from '../../store/actions'

const quotesPerPage = 10

export default function Quotes({quotes}) {
  const {isFetching, phrase} = useSelector(state => state)
  const translate = useTranslate()
  const transliterate = useTransliterate()
  const [current, setCurrent] = useState(0)

  if (isFetching) return <img src={preloader} alt="loading..." />
  window.scrollTo(0, 0)

  const totalPages = Math.ceil(quotes.length / quotesPerPage)
  const startPosition = current * quotesPerPage

  const mappedQuotes = quotes
    .filter((q, i) => i >= startPosition && i < startPosition + quotesPerPage)
    .map(q => <Quote key={q._id} quote={q} />)

  return (
    <div>
      {phrase && <small>{translate('SHOWING_RESULTS')} "{transliterate(phrase)}":</small>}
      {mappedQuotes}
      {totalPages > 1 && (
        <Pagionation totalPages={totalPages} current={current} setCurrent={setCurrent} />
      )}
    </div>
  )
}
