import React, { useState} from 'react'
import {Link} from 'react-router-dom'

import Filters from './Filters'
import Authors from './Authors'

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const searchIcon = <span role="img" aria-label="search" className="search">&#x1F50D;</span>

  const toggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

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
          <Authors/>
        </div>
      }
    </aside>
  )
}

export default Sidebar
