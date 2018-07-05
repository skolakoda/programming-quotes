import React from 'react'
import {connect} from 'react-redux'

import {setPhrase} from '../../store'
import './Filters.css'
import translate from '../../shared/translate'

const Filters = ({ setPhrase, filterAuthors }) => (
  <div className="filters">
    <h3>{translate('SEARCH_QUOTES')}</h3>
    <input onChange={e => setPhrase(e.target.value)} />

    <h3>{translate('SEARCH_AUTHORS')}</h3>
    <input onChange={e => filterAuthors(e.target.value)} />
  </div>
)

const mapDispatchToProps = { setPhrase }

export default connect(null, mapDispatchToProps)(Filters)