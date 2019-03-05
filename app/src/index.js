import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'font-awesome/css/font-awesome.min.css';
import 'materialize-css/dist/css/materialize.min.css';
import './index.css';


const render = () => {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
};

render();
registerServiceWorker();
