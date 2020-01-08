import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Filters from './Filters'
import AuthorThumb from './AuthorThumb'
import {getAuthorThumbs, filterQuotes} from '../../store/actions'
import './Sidebar.css'

const Sidebar = () => {
  const dispatch = useDispatch()
  const {thumbnails, allAuthors, filteredAuthors} = useSelector(state => state)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedAuthors, setSelectedAuthors] = useState(new Set())

  useEffect(() => {
    if (sidebarOpen && allAuthors.size) dispatch(getAuthorThumbs(allAuthors))
  }, [allAuthors, dispatch, sidebarOpen])

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
        <span role="img" aria-label="search" className="search-icon">&#x1F50D;</span>
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
