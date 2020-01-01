import React, { useState} from 'react'
import {Link} from 'react-router-dom'
import { useSelector } from 'react-redux'

import Filters from './Filters'
import AuthorThumb from './AuthorThumb'

const Sidebar = () => {
  const {thumbnails, filteredAuthors} = useSelector(state => state)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const searchIcon = <span role="img" aria-label="search" className="search">&#x1F50D;</span>

  const toggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const authors = filteredAuthors.map(author =>
    <AuthorThumb
      key={author}
      author={author}
      image={thumbnails.get(author)}
    />
  )

  return (
    <aside className="sidebar">
      <button onClick={toggle} className="toggle-button">
        {sidebarOpen ?
          searchIcon
          : <Link to="/all-quotes" className="no-link" replace>{searchIcon}</Link>
        }
      </button>
      {sidebarOpen &&
        <div className="sidebar-inner">
          <Filters/>
          <div className="authors">
            {authors}
          </div>
        </div>
      }
    </aside>
  )
}

export default Sidebar
