import React from 'react'
import './MessagePopup.css'

export default (props) => {
    return (
      <div>
        <div className="white_content">
          <h3>{props.message}</h3>
          <button onClick={() => props.closePopup()}>Close</button>
        </div>   
        <div  className="black_overlay" onClick={() => props.closePopup()} ></div>
      </div>
      )
  }