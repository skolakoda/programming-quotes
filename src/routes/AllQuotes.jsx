import React from 'react'
import {useSelector} from 'react-redux'

import {useTranslate} from '../store/actions'
import Quotes from '../components/main/Quotes'

const AllQuotes = () => {
  const {filteredQuotes} = useSelector(state => state)
  const translate = useTranslate()

  return (
    <main>
      <h1>{translate('ALL_QUOTES')}</h1>
      <Quotes quotes={filteredQuotes} />
    </main>
  )
}

export default AllQuotes
