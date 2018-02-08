import React from 'react'
import Github from './Github'
import translate from '../../shared/translate'

const Navigation = ({language, changeLang}) => (
  <header>
    <Github repoUrl="https://github.com/skolakoda/programerski-citati" />
    <h1>{ translate("PROGRAMMING_QUOTES", language) }</h1>
    <button onClick={() => changeLang('sr')} className="lang-btn">SRB</button>
    <button onClick={() => changeLang('en')} className="lang-btn">ENG</button>
  </header>
)

export default Navigation
