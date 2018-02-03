import React from 'react'
import {Link} from 'react-router-dom'
import './Nav.css'

class Nav extends React.Component {
  render() {
    return (

      <div className="nav">
        <ul>
          <Link to='/'>Citati</Link>
          <Link to='/AddQuote'>Dodaj Citat</Link>
         
        </ul>
      </div>
    );
  }
}

export default Nav;
