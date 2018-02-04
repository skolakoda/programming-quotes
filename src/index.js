import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter} from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'
import Wrap from './components/Wrap'
import './index.css'

ReactDOM.render(
    <BrowserRouter>
      <Wrap/>
       </BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
