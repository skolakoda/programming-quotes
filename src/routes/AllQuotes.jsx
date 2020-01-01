import React from 'react'
import {useSelector} from 'react-redux'

import {useTranslate} from '../store/actions'
import Paginated from '../components/main/Paginated'
import {includes} from '../shared/helpers'

const AllQuotes = () => {
  const {lang, allQuotes, phrase} = useSelector(state => state)
  const translate = useTranslate()

  const filtered = allQuotes
    .filter(quote => includes(quote[lang], phrase))

  return (
    <main>
      <h1>{translate('ALL_QUOTES')}</h1>
      {phrase && <small>{translate('SHOWING_RESULTS')} "{phrase}":</small>}
      <Paginated filteredQuotes={filtered} />
    </main>
  )
}

export default AllQuotes
