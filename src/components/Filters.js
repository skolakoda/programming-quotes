import React from 'react';
import {sortirajAbecedno} from '../shared/helpers'
import './Filters.css'

const Filters = ({ authorImages, authors, language, setPhrase, setAuthor }) => {
  const sortirano = [...authors].sort(sortirajAbecedno)

  const sortedAuthors = sortirano.map((author, i) =>
    <div key={i} onClick={() =>setAuthor(author)}>
      {authorImages.get(author) ? <img src={authorImages.get(author)} alt={author} /> : ''}
      {author}
    </div>
  )

  return (
    <aside className="filters">
      <div className="filters-inner">

        <h3 name="language">{language === 'en' ? 'Search text' : 'Pretraži tekst'}</h3>
        <input name="tekst" onChange={setPhrase} />

        <h3>{language === 'en' ? 'Choose the author' : 'Izaberi autora'}</h3>
        <button className="svi-autori" onClick={() => setAuthor('')}>
          {language === 'en' ? 'All authors' : 'Svi autori'}
        </button>
        {sortedAuthors}

      </div>
    </aside>
  )
}

export default Filters
