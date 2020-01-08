import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import Filters from './Filters'
import AuthorThumb from './AuthorThumb'
import {getAuthorThumbs, filterQuotes} from '../../store/actions'
import './Sidebar.css'

const Sidebar = () => {
  const dispatch = useDispatch()
  const {thumbnails, allAuthors, filteredAuthors} = useSelector(state => state)

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedAuthors, setSelectedAuthors] = useState(new Set())

  useEffect(() => {
    if (sidebarOpen && allAuthors.size) dispatch(getAuthorThumbs(allAuthors))
  }, [allAuthors, dispatch, sidebarOpen])

  const searchIcon = <span role="img" aria-label="search" className="search-icon">&#x1F50D;</span>

  const toggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleCheck = ({target}) => {
    const method = target.checked ? 'add' : 'delete'
    selectedAuthors[method](target.value)
    setSelectedAuthors(selectedAuthors)
    dispatch(filterQuotes('', selectedAuthors))
  }

  const authors = filteredAuthors.map(author =>
    <AuthorThumb
      key={author}
      author={author}
      image={thumbnails.get(author)}
      handleCheck={handleCheck}
    />
  )

  return (
    <aside className="sidebar">
      <button onClick={toggle} className="toggle-button">
        {sidebarOpen || window.location.hash.includes('author') ?
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
