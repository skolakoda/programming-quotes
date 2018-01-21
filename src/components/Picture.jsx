import React from 'react'
import './Picture.css'

const Picture =(props)=>{
  return(
    <div className="thumbnail">
      <h3>{props.autor}</h3>
        <img  src={props.slika} alt="150"/>
      </div>
    );
}
export default Picture
