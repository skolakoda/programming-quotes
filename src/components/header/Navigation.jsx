import React from 'react'
import Github from './Github'
import {Link} from 'react-router-dom'
import translate from '../../shared/translate'
import './Navigation.css'

const Navigation = ({setLang}) => (
  <header>
    <Github repoUrl="https://github.com/skolakoda/programerski-citati" />
    <h1>{translate('PROGRAMMING_QUOTES')}</h1>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/add-quote">Add quote</Link>
      <Link to="/login">Login</Link>
      <div>
        <button onClick={() => setLang('sr')} className="lang-btn">SRB</button>
        <button onClick={() => setLang('en')} className="lang-btn">ENG</button>
      </div>
    </nav>
  </header>
)

export default Navigation
