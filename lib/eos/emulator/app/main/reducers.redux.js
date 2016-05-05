/**
 * main application state
 */

import {combineReducers} from 'redux';

/* REDUX reducers */
const connected = (state = false, action) => {
    switch (action.type) {
        case 'CONNECT':
            return true;
        case 'DISCONNECT':
            return false;
        default:
            return state;
    }
};

const leds = (state, action) => {
    switch (action.type) {
        case 'LEDS_UPDATE':
            return action.leds;
        default:
            let defaultState = (new Array(120)).map(() => [0, 0, 0]);
            return defaultState;
    }
};

const visType = (state = 'fancy', action) => {
    switch(action.type) {
        case 'VIS_TYPE_UPDATE':
            return action.visType;
        default:
            return state;
    }
};

const emulatorApp = combineReducers({connected, leds, visType});
export default emulatorApp;