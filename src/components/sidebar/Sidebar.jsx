import React, {Component} from 'react'
import {connect} from 'react-redux'

import Filters from './Filters'
import Authors from './Authors'
import './Sidebar.css'

class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {authors: []}
  }

  componentWillReceiveProps(nextProps) {
    this.setState({authors: [...nextProps.allAuthors]})
  }

  filterAuthors = text => {
    const filtered = [...this.props.allAuthors]
      .filter(name => name.toLowerCase().includes(text.toLowerCase()))
    this.setState({authors: filtered})
  }

  render() {
    return (<aside className="sidebar">
      <div className="sidebar-inner">
        <Filters filterAuthors={this.filterAuthors}/>
        <Authors authors={this.state.authors}/>
      </div>
    </aside>)
  }
}

const mapStateToProps = ({allAuthors}) => ({allAuthors})

export default connect(mapStateToProps)(Sidebar)
