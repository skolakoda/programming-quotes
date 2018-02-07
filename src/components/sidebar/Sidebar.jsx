import React from 'react'
import Filters from './Filters'
import Authors from './Authors'
import './Sidebar.css'

const Sidebar = ({ authorImages, authors, language, setPhrase, setAuthor }) => {
  return (
    <aside>
      <div className="sidebar-inner">
        <Filters language={language} setPhrase={setPhrase} setAuthor={setAuthor} />
        <Authors authorImages={authorImages} authors={authors} setAuthor={setAuthor} />
      </div>
    </aside>
  )
}

export default Sidebar
