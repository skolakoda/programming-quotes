import React, {useEffect, useState} from 'react'
import {displayName, fetchImage} from '../../shared/helpers'
import unknownImage from '../../assets/images/unknown.jpg'

const responsiveBreakpoint = 800

export default function AuthorImage({author, showUnknown = false}) {
  const [image, setImage] = useState(null)

  useEffect(() => {
    let active = true
    setImage(null)
    const imgWidth = window.innerWidth < responsiveBreakpoint ? window.innerWidth : 250
    const unknown = showUnknown ? unknownImage : ''
    fetchImage(author, imgWidth)
      .catch(() => undefined)
      .then(src => {
        if (active) setImage({author, showUnknown, src: src || unknown, loaded: false})
      })
    return () => { active = false }
  }, [author, showUnknown])

  if (!image?.src || image.author !== author || image.showUnknown !== showUnknown) return null

  const handleError = () => setImage(current => current === image ? {
    ...image, loaded: false, src: showUnknown && image.src !== unknownImage ? unknownImage : ''
  } : current)

  return (
    <img
      key={image.src}
      className="main-image"
      src={image.src}
      style={image.loaded ? {} : {display: 'none'}}
      onLoad={() => setImage(current => current === image ? {...image, loaded: true} : current)}
      onError={handleError}
      alt={displayName(author)}
    />
  )
}
