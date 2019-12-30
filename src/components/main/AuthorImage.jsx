import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'

// import unknownImage from '../../assets/images/unknown.jpg'

const mdMin = 800

const AuthorImage = ({ author, allImages }) => {
  const [loaded, setLoaded] = useState(false)
  const [src, setSrc] = useState('')

  useEffect(() => {
    setLoaded(false)
    const authorSrc = allImages.get(author)
    const imgWidth = window.innerWidth < mdMin ? window.innerWidth : 250
    const newSrc = authorSrc ? authorSrc.replace(/\d+px/, `${imgWidth}px`) : ''
    setSrc(newSrc)
  }, [allImages, author])

  return (
    <img
      className="main-image"
      src={src}
      style={loaded ? {} : {display: 'none'}}
      onLoad={() => setLoaded(true)}
      alt={'author'}
    />
  )
}

const mapStateToProps = ({allImages}) => ({allImages})

export default connect(mapStateToProps)(AuthorImage)
