import React, {Component} from 'react'
import Filters from './Filters'
import Authors from './Authors'
import './Sidebar.css'

class Sidebar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      filteredAuthors: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.authors !== this.props.authors)
      this.setState({ filteredAuthors: [...nextProps.authors] })
  }

  filterAuthors = text => {
    const filteredAuthors = [...this.props.authors].filter(
      name => name.toLowerCase().includes(text.toLowerCase())
    )
    this.setState({filteredAuthors})
  }

  render() {
    return (
      <aside className="sidebar">
        <div className="sidebar-inner">
          <Filters setPhrase={this.props.setPhrase} filterAuthors={this.filterAuthors} />
          <Authors authorImages={this.props.authorImages} authors={this.state.filteredAuthors} />
        </div>
      </aside>
    )
  }
}

export default Sidebar
