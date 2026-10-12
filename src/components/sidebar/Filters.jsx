import React, {useId} from 'react'
import {connect} from 'react-redux'
import {useLocation, useNavigate} from 'react-router'

import {setPhrase} from '../../store/actions'
import './Filters.css'
import {useTranslate} from '../../shared/translate'

const Filters = ({ phrase, setPhrase, filterAuthors }) => {
  const translate = useTranslate()
  const quoteSearchId = useId()
  const authorSearchId = useId()
  const {pathname} = useLocation()
  const navigate = useNavigate()
  const searchQuotes = value => {
    setPhrase(value)
    const showsFilteredQuotes = pathname === '/all-quotes' || pathname.startsWith('/author/')
    if (value && !showsFilteredQuotes) navigate('/all-quotes')
  }

  return (
    <>
      <div className="filters quote-search">
        <h3><label htmlFor={quoteSearchId}>{translate('SEARCH_QUOTES')}</label></h3>
        <input id={quoteSearchId} type="search" value={phrase} onChange={e => searchQuotes(e.target.value)} />
      </div>
      <div className="filters">
        <h3><label htmlFor={authorSearchId}>{translate('SEARCH_AUTHORS')}</label></h3>
        <input id={authorSearchId} type="search" onChange={e => filterAuthors(e.target.value)} />
      </div>
    </>
  )
}

const mapStateToProps = ({phrase}) => ({phrase})
const mapDispatchToProps = { setPhrase }

export default connect(mapStateToProps, mapDispatchToProps)(Filters)