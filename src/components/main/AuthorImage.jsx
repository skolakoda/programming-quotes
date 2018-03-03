import React from 'react'
import unknownImage from '../../assets/images/unknown.jpg'

const responsiveBreakpoint = 800

const AuthorImage = ({author, allImages, showUnknown}) => {
  const src = allImages.get(author)
  const imgWidth = window.innerWidth < responsiveBreakpoint ? window.innerWidth : 250
  const unknown = showUnknown ? unknownImage : ''
  const newSrc = src ? src.replace(/\d+px/, `${imgWidth}px`) : unknown
  if (!newSrc) return null

  return (
    <img className="main-image" src={newSrc} alt={author} />
  )
}
export default AuthorImage
