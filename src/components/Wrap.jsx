import React from 'react'
import {Route} from 'react-router-dom'
import App from './App'
import Nav from './Nav'
import AddQuote from './AddQuote'


class Wrap extends React.Component {
  render() {
    return (
      <div>
        <Nav/>
        <Route exact path="/" component={App}/>
        <Route path="/addQuote" component={AddQuote}/>
      </div>
    );
  }
}

export default Wrap;
