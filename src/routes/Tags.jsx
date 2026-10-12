import React from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import {useTranslate} from '../shared/translate'
import {usePageTitle} from '../shared/usePageTitle'
import {tags} from '../shared/tags'
import './Tags.css'

const minSize = 1
const maxSize = 2.2

function Tags({language, allQuotes}) {
  const translate = useTranslate()
  usePageTitle(translate('TOPICS'))
  const translated = allQuotes.filter(quote => quote[language])
  const counts = [...tags].sort().map(tag => [tag, translated.filter(quote => quote.tags?.includes(tag)).length])
  const max = Math.max(1, ...counts.map(([, count]) => count))

  return (
    <main>
      <h1>{translate('TOPICS')}</h1>
      <ul className="tag-cloud">
        {counts.filter(([, count]) => count).map(([tag, count]) =>
          <li key={tag} style={{fontSize: `${minSize + (maxSize - minSize) * count / max}em`}}>
            <Link to={`/tag/${tag}`} className="tag">{tag} <small>{count}</small></Link>
          </li>
        )}
      </ul>
    </main>
  )
}

const mapStateToProps = ({language, allQuotes}) => ({language, allQuotes})

export default connect(mapStateToProps)(Tags)
