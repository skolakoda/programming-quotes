import React, {Component} from 'react'
import Filters from './Filters'
import Authors from './Authors'
import './Sidebar.css'

class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {authors: []}
  }

  componentWillReceiveProps(nextProps) {
    this.setState({authors: [...nextProps.authors]})
  }

  filterAuthors = text => {
    const filtered = [...this.props.authors]
      .filter(name => name.toLowerCase().includes(text.toLowerCase()))
    this.setState({authors: filtered})
  }

  render() {
    return (<aside className="sidebar">
      <div className="sidebar-inner">
        <Filters setPhrase={this.props.setPhrase} filterAuthors={this.filterAuthors}/>
        <Authors authors={this.state.authors} allImages={this.props.allImages}/>
      </div>
    </aside>)
  }
}

export default Sidebar
