import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';

const {Component} = React;

const MESSAGE_INIT    = 'INIT',
      MESSAGE_HALOGEN = 'HALOGEN',
      MESSAGE_LED     = 'LED',
      MESSAGE_PANIC   = 'PANIC';

const NUM_LEDS = 120;

let visType = 'fancy'; // 'fast' or 'fancy'

let socket = io();
socket.on('connect', () => {
    console.log('[Socket] connected!');
    $('#connected').addClass('connected');
});
socket.on('disconnect', () => {
    $('#connected').removeClass('connected');
});

socket.on('message', function handleMessage (message) {
    switch (message.type) {
        case MESSAGE_INIT:
            console.log('initialized');
            break;
        case MESSAGE_HALOGEN:
            $('#halogen').text(message.value);
            break;
        case MESSAGE_LED:
            //$('#led').text(message.value);
            renderLeds(message.value, visType);
            break;
        case MESSAGE_PANIC:
            $('#error').text('PANIC!');
            break;
    }
});

// initialize the led items
$(document).ready(() => {
    console.log('initializing DOM');
    for (var i = 0; i < NUM_LEDS; i++) {
        $('.leds').append('<div class="led-item"></div>');
    }

    // set the visType
    $('.leds').addClass('vis-type-' + visType);
});

/**
 * REACT stuff
 */
let Leds = ({values, visType}) =>
    <div className={classNames('leds', {[`vis-type-${visType}`]: true})}>
        {values.map((value) => {
            let color = 'rgb(' + value.join(',') + ')';
            let style =
                    visType === 'fancy'
                        ? {backgroundImage : 'radial-gradient(ellipse farthest-side, ' + color + ', rgba(0,0,0,0)'}
                        : {backgroundColor : color};
            return <span className="led-item" style={style}></span>
        })}
    </div>;

const renderLeds = (ledValues, visType) => {
    ReactDOM.render(
        <Leds values={ledValues} visType={visType}/>,
        document.getElementById('root')
    );
};