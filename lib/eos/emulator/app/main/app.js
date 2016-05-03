var MESSAGE_INIT = 'INIT',
    MESSAGE_HALOGEN = 'HALOGEN',
    MESSAGE_LED = 'LED',
    MESSAGE_PANIC = 'PANIC';

var visType = 'fancy'; // 'fast' or 'fancy'

var socket = io();
socket.on('connect', function () {
    console.log('connected!');
    $('#connected').addClass('connected');

});
socket.on('disconnect', function(){
    $('#connected').removeClass('connected');
});

socket.on('message', function (message) {
    switch (message.type) {
        case MESSAGE_INIT:
            console.log('initialized');
            break;
        case MESSAGE_HALOGEN:
            $('#halogen').text(message.value);
            break;
        case MESSAGE_LED:
            //$('#led').text(message.value);
            applyLedItems(message.value, visType);
            break;
        case MESSAGE_PANIC:
            $('#error').text('PANIC!');
            break;
    }
});
console.log('Socket.io initialized!!');

// initialize the led items
$(document).ready(function(){
    console.log('initializing DOM');
    for(var i = 0; i < 120; i++){
        $('#led').append('<div class="led-item"></div>');
    }

    // set the visType
    $('#led').addClass('vis-type-' + visType);
});

/**
 *
 * @param values
 * @param visType - visualisation type, can be 'fast' or 'fancy'
 */
function applyLedItems(values, visType){
    var color, cssVal;
    var ledChildren = $('#led')[0].children;
    console.assert(ledChildren.length === values.length);
    //console.log('ledChildren', ledChildren);

    for(var i = 0; i < values.length; i++){
        if(visType === 'fast'){
            color = 'rgb(' + values[i].join(',') + ')';
            $(ledChildren[i]).css('background-color', color);
        } else if(visType === 'fancy'){
            color = 'rgb(' + values[i].join(',') + ')';
            cssVal = 'radial-gradient(ellipse farthest-side, '+ color + ', rgba(0,0,0,0)';//;
            $(ledChildren[i]).css('background-image', cssVal);
        }
    }
}