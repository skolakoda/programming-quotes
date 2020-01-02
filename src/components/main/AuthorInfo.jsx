import React, {useState, useEffect} from 'react'
import {findValue} from '../../shared/helpers'

const prepareInfo = (author, info) => {
  if (!info) return ''
  const wikiUrl = `https://sh.wikipedia.org/wiki/${encodeURIComponent(author)}`
  return `${info} <a href=${wikiUrl} target="_blank">Wikipedia</a>`
}

export default function AuthorInfo({ author }) {
  const [info, setInfo] = useState('')

  useEffect(() => {
    setInfo('')
    fetch(`https://sh.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(author)}&prop=extracts&format=json&origin=*&redirects=1&exsentences=2&exintro=1`)
      .then(response => response.json())
      .then(obj => {
        const info = findValue(obj, 'extract')
        setInfo(prepareInfo(author, info))
      })
  }, [author])

  return (
    <small dangerouslySetInnerHTML={{__html: info}}></small>
  )
}
