import React, {useState} from 'react'
import {connect} from 'react-redux'

import Filters from './Filters'
import Authors from './Authors'
import './Sidebar.css'

function Sidebar({allAuthors}) {
  const [filter, setFilter] = useState({source: allAuthors, text: ''})
  if (filter.source !== allAuthors) {
    setFilter({source: allAuthors, text: ''})
  }
  const text = filter.source === allAuthors ? filter.text : ''
  const authors = [...allAuthors].filter(name => name.toLowerCase().includes(text.toLowerCase()))
  const filterAuthors = text => setFilter({source: allAuthors, text})

  return (<aside className="sidebar">
    <div className="sidebar-inner">
      <Filters filterAuthors={filterAuthors}/>
      <Authors authors={authors}/>
    </div>
  </aside>)
}

const mapStateToProps = ({allAuthors}) => ({allAuthors})

export default connect(mapStateToProps)(Sidebar)
