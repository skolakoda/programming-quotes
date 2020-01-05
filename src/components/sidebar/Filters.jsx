import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {filterQuotes, filterAuthors, useTranslate} from '../../store/actions'

const Filters = () => {
  const {phrase, authorPhrase} = useSelector(state => state)
  const translate = useTranslate()
  const dispatch = useDispatch()

  const changePhrase = e => dispatch(filterQuotes(e.target.value))

  const changeAuthorPhrase = e => dispatch(filterAuthors(e.target.value))

  return (
    <div className="filters">
      <h3><label htmlFor="izreke">{translate('SEARCH_QUOTES')}</label></h3>
      <input id="izreke" value={phrase} placeholder="latin input" onChange={changePhrase} />

      <h3><label htmlFor="avtori">{translate('SEARCH_AUTHORS')}</label></h3>
      <input id="avtori" value={authorPhrase} onChange={changeAuthorPhrase} />
    </div>
  )}

export default Filters