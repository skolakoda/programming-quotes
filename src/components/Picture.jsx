import React from 'react'
import './Picture.css'

const Picture = ({ autor, imgSrc }) => {
  return imgSrc === '' ? '' : (
    <div className="thumbnail">
      <h3>{autor}</h3>
      <img  src={imgSrc} alt="Loading..."/>
    </div>
  );
}
export default Picture
