import React, {useState, useEffect} from 'react'

import {getImg, getSize} from '../../utils/helpers'
import chakra from '../../assets/images/chakra.svg'

const mdMin = 800
const imgWidth = window.innerWidth < mdMin ? window.innerWidth : 250

const AuthorImage = ({author}) => {
  const [loaded, setLoaded] = useState(false)
  const [src, setSrc] = useState(null)

  useEffect(() => {
    const nextSrc = getSize(getImg(author), imgWidth)

    if (nextSrc === src) return // same image, do nothing

    setLoaded(false)
    if (nextSrc) { // use nextSrc
      setSrc(nextSrc)
      return
    }

    // ask api for src
    fetch(`https://sh.wikipedia.org/w/api.php?action=query&titles=${author}&prop=pageimages&format=json&pithumbsize=${imgWidth}&origin=*`)
      .then(res => res.json())
      .then(res => {
        if (!res.query.pages) return
        for (const key in res.query.pages) {
          const obj = res.query.pages[key]
          if (obj.thumbnail) return setSrc(obj.thumbnail.source)
        }
        if (!src) setSrc(chakra)
      })
      .catch(() => {
        setSrc(chakra)
        setLoaded(true) // istu sliku ne ucitava opet, pa ostaje false
      })
  }, [author, src])

  return (
    <img
      className="main-image"
      src={src}
      style={{opacity: +loaded, transition: 'opacity .4s' }}
      onLoad={() => setLoaded(true)}
      alt={author}
      width={imgWidth + 'px'}
    />
  )
}

export default AuthorImage
