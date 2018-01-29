import React from 'react'
import './Picture.css'

const Picture = ({ author, imgSrc }) => {
  return imgSrc === '' ? '' : (
    <div className="thumbnail">
      <h3>{author}</h3>
      <img  src={imgSrc} alt="Loading..."/>
    </div>
  );
}
export default Picture
