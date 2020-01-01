import React from 'react'
import {useSelector} from 'react-redux'

import {useTranslate} from '../store/actions'
import Paginated from '../components/main/Paginated'

const AllQuotes = () => {
  const {filteredQuotes} = useSelector(state => state)
  const translate = useTranslate()

  return (
    <main>
      <h1>{translate('ALL_QUOTES')}</h1>
      <Paginated filteredQuotes={filteredQuotes} />
    </main>
  )
}

export default AllQuotes
