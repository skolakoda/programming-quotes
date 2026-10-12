import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import PieChart from '../components/statistics/PieChart'
import {useTranslate} from '../shared/translate'
import {usePageTitle} from '../shared/usePageTitle'
import {displayName} from '../shared/helpers'
import {languages} from '../shared/languages'
import './Statistics.css'

const minQuotesForSlice = 10
const pieColors = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#6250d6', '#e34948']
const otherColor = '#c3c2b7'

function countByAuthor(quotes) {
  const counts = new Map()
  quotes.forEach(({author}) => counts.set(author, (counts.get(author) || 0) + 1))
  return [...counts].sort(([a, x], [b, y]) => y - x || a.localeCompare(b))
}

function authorSlices(authors, otherLabel) {
  const slices = authors.filter(([, count]) => count >= minQuotesForSlice)
    .map(([author, count], i) => ({label: displayName(author), value: count, color: pieColors[i % pieColors.length]}))
  const other = authors.slice(slices.length).reduce((sum, [, count]) => sum + count, 0)
  if (other) slices.push({label: otherLabel, value: other, color: otherColor})
  return slices
}

function Statistics({allQuotes}) {
  const translate = useTranslate()
  usePageTitle(translate('STATISTICS'))
  const authors = countByAuthor(allQuotes)
  const maxCount = authors.length ? authors[0][1] : 0

  return (
    <main className="statistics">
      <h1>{translate('STATISTICS')}</h1>
      <dl>
        <dt>{translate('QUOTES')}</dt>
        <dd>{allQuotes.length}</dd>
        <dt>{translate('AUTHORS')}</dt>
        <dd>{authors.length}</dd>
      </dl>
      <h2>{translate('TRANSLATIONS')}</h2>
      <div className="meters">
        {languages.map(({code, lang, name}) => {
          const count = allQuotes.filter(quote => quote[code]).length
          return (
            <React.Fragment key={code}>
              <span lang={lang}>{name}</span>
              <span aria-hidden="true" className="track">
                <span className="bar" style={{width: `${count / (allQuotes.length || 1) * 100}%`}} />
              </span>
              <span className="value">{count} / {allQuotes.length}</span>
            </React.Fragment>
          )
        })}
      </div>
      <h2>{translate('QUOTES_BY_AUTHOR')}</h2>
      <PieChart slices={authorSlices(authors, translate('OTHER_AUTHORS'))} label={translate('QUOTES_BY_AUTHOR')} />
      <table>
        <thead>
          <tr>
            <th>{translate('AUTHOR')}</th>
            <th>{translate('QUOTES')}</th>
            <th aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {authors.map(([author, count]) =>
            <tr key={author}>
              <td><Link to={`/author/${author.replace(/ /g, '_')}`}>{displayName(author)}</Link></td>
              <td>{count}</td>
              <td aria-hidden="true" className="bar-cell">
                <span className="bar" style={{width: `${count / maxCount * 100}%`}} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  )
}

const mapStateToProps = ({allQuotes}) => ({allQuotes})

export default connect(mapStateToProps)(Statistics)
