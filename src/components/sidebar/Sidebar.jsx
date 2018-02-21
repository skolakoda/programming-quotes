import React from 'react'
import Filters from './Filters'
import Authors from './Authors'
import './Sidebar.css'

const Sidebar = ({ authorImages, authors, setPhrase, filterAuthors }) => (
  <aside className="sidebar">
    <div className="sidebar-inner">
      <Filters setPhrase={setPhrase} filterAuthors={filterAuthors} />
      <Authors authorImages={authorImages} authors={authors} />
    </div>
  </aside>
)

export default Sidebar
