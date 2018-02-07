import React from 'react'

const Navigation = ({ language, changeLang }) => (
  <header>
    <h1>{language === 'en' ? 'Programming quotes' : 'Programerski citati'}</h1>
    <button onClick={() => changeLang('sr')} className="lang-btn">SRB</button>
    <button onClick={() => changeLang('en')} className="lang-btn">ENG</button>
  </header>
)

export default Navigation
