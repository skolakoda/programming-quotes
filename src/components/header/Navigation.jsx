import React from 'react'
import Github from './Github'
import {Link} from 'react-router-dom'
import './Navigation.css'

const Navigation = ({language, setLang, password}) => {
  return (
    <header>
      <Github repoUrl="https://github.com/skolakoda/programerski-citati" />
      <nav>
        <Link to="/">Home</Link>
        {password && <Link to="/add-quote">Add quote</Link>}
        <Link to="/login">Login</Link>
        <div>
          <button
            onClick={() => setLang('en')}
            className={language === 'en' ? 'active' : ''}>ENG</button>
          <button
            onClick={() => setLang('sr')}
            className={language === 'sr' ? 'active' : ''}>SRB</button>
        </div>
      </nav>
    </header>
  )}

export default Navigation
