import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'

const mdMin = 800

const AuthorImage = ({author}) => {
  const {thumbnails} = useSelector(state => state)
  const imgWidth = window.innerWidth < mdMin ? window.innerWidth : 250

  const [loaded, setLoaded] = useState(false)
  const [src, setSrc] = useState('')

  useEffect(() => {
    const hasImage = () => thumbnails.size && thumbnails.get(author)
    const getSrc = () => thumbnails.get(author).replace(/\d+px/, `${imgWidth}px`)

    if (hasImage() && getSrc() === src) return // same image, do nothing

    setLoaded(false)
    if (hasImage()) return setSrc(getSrc()) // load different image size

    // else ask api for new src
    fetch(`https://sh.wikipedia.org/w/api.php?action=query&titles=${author}&prop=pageimages&format=json&pithumbsize=${imgWidth}&origin=*`)
      .then(res => res.json())
      .then(res => {
        if (!res.query.pages) return
        for (const key in res.query.pages) {
          const obj = res.query.pages[key]
          if (obj.thumbnail) return setSrc(obj.thumbnail.source)
        }
        if (!src) setSrc('chakra.svg')
      })
      .catch(() => {
        setSrc('chakra.svg')
        setLoaded(true) // istu sliku ne ucitava opet, pa ostaje false
      })
  }, [author, imgWidth, src, thumbnails])

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
