import React from 'react'
import './Filters.css'

const Filters = ({ language, setPhrase, setAuthor }) => (
  <div className="filters">
    <h3 name="language">{language === 'en' ? 'Search text' : 'Pretraži tekst'}</h3>
    <input name="tekst" onChange={setPhrase} />

    <h3>{language === 'en' ? 'Choose the author' : 'Izaberi autora'}</h3>
    <button className="btn-authors" onClick={() => setAuthor('')}>
      {language === 'en' ? 'All authors' : 'Svi autori'}
    </button>
  </div>
)

export default Filters
