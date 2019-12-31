import React, { useState, useEffect} from 'react'
import { connect } from 'react-redux'

import Filters from './Filters'
import Authors from './Authors'
import {includes} from '../../shared/helpers'

const Sidebar = ({ allAuthors }) => {
  const [visibleAuthors, setVisibleAuthors] = useState([...allAuthors])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setVisibleAuthors([...allAuthors])
  }, [allAuthors])

  const filterAuthors = phrase => {
    const filtered = [...allAuthors].filter(name => includes(name, phrase))
    setVisibleAuthors(filtered)
  }

  const toggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <aside className="sidebar">
      <button onClick={toggle} className="toggle-button">
        <span role="img" aria-label="search" className="search">&#x1F50D;</span>
      </button>
      {sidebarOpen &&
        <div className="sidebar-inner">
          <Filters filterAuthors={filterAuthors}/>
          <Authors authors={visibleAuthors}/>
        </div>
      }
    </aside>
  )
}

const mapStateToProps = ({allAuthors}) => ({allAuthors})

export default connect(mapStateToProps)(Sidebar)
