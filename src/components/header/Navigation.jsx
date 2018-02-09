import React from 'react'
import Github from './Github'
import translate from '../../shared/translate'

const Navigation = ({setLang}) => (
  <header>
    <Github repoUrl="https://github.com/skolakoda/programerski-citati" />
    <h1>{translate('PROGRAMMING_QUOTES')}</h1>
    <button onClick={() => setLang('sr')} className="lang-btn">SRB</button>
    <button onClick={() => setLang('en')} className="lang-btn">ENG</button>
  </header>
)

export default Navigation
