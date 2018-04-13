import React from 'react';
import './Chart.css'

class Chart extends React.Component {

  render() {

    const entr = this.props.entr;             //Authors and number of quotes by each
    const allQuotes = this.props.allQuotes;   //for dividing and gainig precentage

    //console.log(allQuotes);



  //Making a list with Object entries - Authors and number of quotes by each

    const list = entr.map((num, i) => 
    // num - shows the number of quotes per author
    <div className="chartdiv">

      <ul className="chartlist">
        <li className="listpart"> 
       {num[0]}: 
          <div className="blue" style={{background:'blue', width:(((num[1])*100/allQuotes.length))*5+'%', height:"1em"}} key={i}>
          </div>
          <div className="number">{(num[1]/(allQuotes.length)*100).toFixed(1)+'%'}</div>
        </li> 
      </ul> 

    </div> 

   );

      return (
      <ul>{list}</ul>
    );

  }


}


export default Chart;


    // var keys = [],
    // i = 0;
    // for (keys[i++] in recnikAutora) {}