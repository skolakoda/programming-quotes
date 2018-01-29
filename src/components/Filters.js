import React from 'react';
import {sortirajAbecedno} from '../shared/helpers'
import './Filters.css'

const Filters = props => {

  const sortirano = [...props.authors].sort(sortirajAbecedno)

  const authors = sortirano.map((author, i) =>
    <div key={i} onClick={() =>props.setAuthor(author)}>
      {props.authorImages.get(author) ? <img src={props.authorImages.get(author)} alt={author} /> : ''}
      {author}
    </div>
  )

  return (
    <aside className="filters">
      <div className="filters-inner">

        <h3>{props.language === 'en' ? 'Search text' : 'Pretraži tekst'}</h3>
        <input name="tekst" onChange={props.setPhrase} />

        <h3>{props.language === 'en' ? 'Choose the author' : 'Izaberi autora'}</h3>
        <button className="svi-autori" onClick={() =>props.setAuthor('')}>{props.language === 'en' ? 'All authors' : 'Svi autori'}</button>
        {authors}

      </div>
    </aside>
  )
}

export default Filters
