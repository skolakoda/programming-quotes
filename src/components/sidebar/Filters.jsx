import React from 'react'
import {Link} from 'react-router-dom'
import './Filters.css'
import translate from '../../shared/translate'

const Filters = ({ setPhrase, filterAuthors }) => (
  <div className="filters">
    <h3>{translate('SEARCH_QUOTES')}</h3>
    <Link className="author" to="/">
      <input onChange={setPhrase} />
    </Link>

    <h3>{translate('SEARCH_AUTHORS')}</h3>
    <input onChange={(e) => filterAuthors(e.target.value)} />
  </div>
)

export default Filters
