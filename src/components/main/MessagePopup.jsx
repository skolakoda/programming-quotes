import React from 'react'
import './MessagePopup.css'

export default ({ message, closePopup }) => (
  <div>
    <div className="white_content">
      <h3>{message}</h3>
      <button onClick={closePopup}>Close</button>
    </div>
    <div  className="black_overlay" onClick={closePopup} ></div>
  </div>
)
