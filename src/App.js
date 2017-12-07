import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor() {
    super()
    this.state = {
      citati: []
    }
  }

  componentDidMount() {
    const http = new XMLHttpRequest()
    http.open("GET", "https://raw.githubusercontent.com/skolakoda/skolakoda.github.io/master/_data/quotes.json")
    http.send()
    http.onload = () => {
      const elementi = JSON.parse(http.responseText).map((citat, i) => {
        return (
          <blockquote key={i}>{citat.tekst}</blockquote>
        )
      })
      this.setState((state, props) => {
        return {
          citati: elementi
        }
       })
    }
  }
  
  render() {
    return (
      <div className="App">
        <h1>Zdravo Svete</h1>
        {this.state.citati}
      </div>
    );
  }
}

export default App;
