import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Filters from './Filters'
import AuthorThumb from './AuthorThumb'
import {filterQuotes} from '../../store/actions'
import {getThumbnails, getImg} from '../../utils/helpers'
import './Sidebar.css'

const Sidebar = () => {
  const dispatch = useDispatch()
  const {allAuthors, filteredAuthors} = useSelector(state => state)
  const [thumbnails, setThumbnails] = useState(new Map())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedAuthors, setSelectedAuthors] = useState(new Set())

  const getAuthorThumbs = allAuthors => {
    const withImg = [...allAuthors].filter(x => !getImg(x))
    const withoutImg = [...allAuthors].filter(x => getImg(x))
    getThumbnails(withImg)
      .then(mapa => {
        withoutImg.forEach(name => {
          mapa.set(name, getImg(name))
        })
        setThumbnails(mapa)
      })
  }

  useEffect(() => {
    if (sidebarOpen && allAuthors.size) getAuthorThumbs(allAuthors)
  }, [allAuthors, sidebarOpen])

  const toggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleCheck = ({target}) => {
    const method = target.checked ? 'add' : 'delete'
    selectedAuthors[method](target.value)
    setSelectedAuthors(selectedAuthors)
    dispatch(filterQuotes('', selectedAuthors))
  }

  const authorThumbs = filteredAuthors.map(author =>
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
            {authorThumbs}
          </div>
        </div>
      }
    </aside>
  )
}

export default Sidebar
