import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'

const mdMin = 800

const AuthorImage = ({author}) => {
  const {allImages} = useSelector(state => state)
  const [loaded, setLoaded] = useState(false)
  const [src, setSrc] = useState('')
  const imgWidth = window.innerWidth < mdMin ? window.innerWidth : 250

  useEffect(() => {
    setLoaded(false)
    const authorSrc = allImages.get(author)
    const newSrc = authorSrc ? authorSrc.replace(/\d+px/, `${imgWidth}px`) : ''
    setSrc(newSrc)
  }, [allImages, author, imgWidth])

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
