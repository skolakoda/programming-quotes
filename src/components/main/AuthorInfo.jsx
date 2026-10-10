import React, {useEffect, useState} from 'react'
import translate from '../../shared/translate'
import './AuthorBox.css'

function prepareInfo(info, author) {
  if (!info) return ''
  const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(author)}`
  return `${info} <a href="${wikiUrl}" target="_blank" rel="noopener noreferrer">Wikipedia</a>`
}

export default function AuthorInfo({author}) {
  const [biography, setBiography] = useState(null)

  useEffect(() => {
    let active = true
    setBiography(null)
    fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(author)}&prop=extracts&format=json&origin=*&redirects=1&exsentences=2&exintro=1`)
      .then(response => {
        if (!response.ok) throw new Error(`Unable to load author biography: ${response.status}`)
        return response.json()
      })
      .then(obj => {
        if (!active) return
        if (!obj.query || !obj.query.pages) throw new Error('Missing author biography results')
        const page = Object.values(obj.query.pages).find(page => page.extract)
        setBiography({author, info: prepareInfo(page && page.extract, author), error: false})
      })
      .catch(() => {
        if (active) setBiography({author, info: '', error: true})
      })
    return () => { active = false }
  }, [author])

  const current = biography?.author === author ? biography : null
  if (current?.error) return <small>{translate('NETWORK_PROBLEM')}</small>

  return (
    <small dangerouslySetInnerHTML={{__html: current?.info || ''}}></small>
  )
}
