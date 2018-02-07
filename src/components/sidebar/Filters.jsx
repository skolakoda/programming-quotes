import React from 'react'
import Authors from './Authors'
import './Filters.css'

const Filters = ({ language, setPhrase, setAuthor }) => {
  return (
    <div className="filters">
      <h3 name="language">{language === 'en' ? 'Search text' : 'Pretraži tekst'}</h3>
      <input name="tekst" onChange={setPhrase} />

      <h3>{language === 'en' ? 'Choose the author' : 'Izaberi autora'}</h3>
      <button className="svi-autori" onClick={() => setAuthor('')}>
        {language === 'en' ? 'All authors' : 'Svi autori'}
      </button>
    </div>
  )
}

export default Filters
