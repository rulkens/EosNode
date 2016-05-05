import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import { Provider } from 'react-redux'

import App from './App.rc';
import emulatorApp from './reducers.redux';
import {connect, disconnect, updateLeds} from './actions.redux';



const MESSAGE_INIT    = 'INIT',
      MESSAGE_HALOGEN = 'HALOGEN',
      MESSAGE_LED     = 'LED',
      MESSAGE_PANIC   = 'PANIC';

let store = createStore(emulatorApp);

let socket = io();

socket.on('connect', () => store.dispatch(connect()));
socket.on('disconnect', () => store.dispatch(disconnect()));
socket.on('message', function handleMessage (message) {
    switch (message.type) {
        case MESSAGE_INIT:
            console.log('initialized');
            break;
        // case MESSAGE_HALOGEN:
        //     $('#halogen').text(message.value);
        //     break;
        case MESSAGE_LED:
            store.dispatch(updateLeds(message.value));
            break;
        case MESSAGE_PANIC:
            console.error('PANIC!!!!! Abandon ship');
            break;
    }
});

/**
 * REACT stuff
 */

const render = () => {
    ReactDOM.render(
        <Provider store={store}>
            <App/>
        </Provider>,
        document.getElementById('root')
    );
};
render();