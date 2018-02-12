import React from 'react'
import './Navigation.css'
import {Link} from 'react-router-dom'

const Navigation = ({language, changeLang,isLoged}) => (
  <ul className="nav">
    <Link to='/login'>Login</Link>
    <Link to='/'> Main</Link>
    <Link to='/addQuote'>AddQuote</Link>
    <button onClick={() => changeLang('sr')} className="lang-btn">SRB</button>
    <button onClick={() => changeLang('en')} className="lang-btn">ENG</button>
   
 </ul>
)

export default Navigation
