import React from 'react'
import Github from './Github'

const Header = ({language}) => (
  <header>
    <Github repoUrl="https://github.com/skolakoda/programerski-citati" />
    <h1>{language === 'en'
      ? 'Programming quotes'
      : 'Programerski citati'}</h1>
  </header>
)
export default Header
