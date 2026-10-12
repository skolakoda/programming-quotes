import React from 'react'
import {Link} from 'react-router'

import {useTranslate} from '../shared/translate'
import {usePageTitle} from '../shared/usePageTitle'

export default function NotFound() {
  const translate = useTranslate()
  usePageTitle(translate('NOT_FOUND'))

  return (
    <main>
      <h1>{translate('NOT_FOUND')}</h1>
      <p><Link to="/">{translate('BACK_HOME')}</Link></p>
    </main>
  )
}
