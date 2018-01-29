import React from 'react'
import './Picture.css'

const Picture = ({ autor, slika }) => {
  return slika === '' ? '' : (
    <div className="thumbnail">
      <h3>{autor}</h3>
      <img  src={slika} alt="Loading..."/>
    </div>
  );
}
export default Picture
