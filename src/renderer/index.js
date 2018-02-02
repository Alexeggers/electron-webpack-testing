import './styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';

const rootEl = document.getElementById('app');

function render() {
    let App;
    switch (window.location.hash) {
        case '#foo':
            App = require('./components/AppShell').default;
            break;
        default:
            App = require('./components/HelloWorld').default;
    }
    ReactDOM.render(<App isOpen />, rootEl);
}

if (module.hot) {
    module.hot.accept(['./components/HelloWorld', './components/AppShell'], render);
}

render();
