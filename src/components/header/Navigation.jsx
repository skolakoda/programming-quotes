import React from 'react'
import Github from './Github'
import { Link } from 'react-router-dom'
import translate from '../../shared/translate'

const Navigation = ({setLang}) => (
  <header>
    <Github repoUrl="https://github.com/skolakoda/programerski-citati" />
    <h1>{translate('PROGRAMMING_QUOTES')}</h1>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/add-quote">Add quote</Link>
      <Link to="/edit-quote/3333">Edit quote</Link>
      <Link to="/login">Login</Link>
      {/* naraviti jezicke rute */}
      <button onClick={() => setLang('sr')} className="lang-btn">SRB</button>
      <button onClick={() => setLang('en')} className="lang-btn">ENG</button>
    </nav>
  </header>
)

export default Navigation
