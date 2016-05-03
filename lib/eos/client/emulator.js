/**
 * EOS WebSocket client
 *
 * implements a simple Websocket Interface that communicates with a frontend debug interface
 */
'use strict';

var inherits     = require('inherits'),
    EventEmitter = require('events').EventEmitter,
    _            = require('lodash'),
    color        = require('../util/util.color');

// default host and port
var HOST = '127.0.0.1',//HOST = '192.168.3.51', // TODO: make this dynamic
    PORT = 5155;

var MESSAGE_INIT    = 'INIT',
    MESSAGE_HALOGEN = 'HALOGEN',
    MESSAGE_LED     = 'LED',
    MESSAGE_PANIC   = 'PANIC',
    NUM_LIGHTS      = 32;

var ERROR_START    = 'MER',    //short for MESSAGE_ERROR
    ERROR_ACK      = 0x01,     //the acknowledgement bytes are not valid
    ERROR_SEQ      = 0x02,     // seq_number is not valid (has already been used?)
    ERROR_PWM      = 0x03,     // PWM values are not valid
    ERROR_H_API    = 0x04,     // when something goes wrong in calling the halogen API
    ERROR_H_FORMAT = 0x05,     // something wrong with unpacking the message

    ERROR_L_API    = 0x06,     // when something goes wrong in calling the LED API
    ERROR_L_FORMAT = 0x07;     // something wrong with unpacking the message

var MESSAGE_OK    = 'MOK', // the start of an OK message
    MESSAGE_ERROR = 'MER',
    INIT_OK       = 'IOK';

module.exports = Client;

inherits(Client, EventEmitter);

Client.prototype.send = send;
Client.prototype.sendLed = sendLed;
Client.prototype.connect = connect;
Client.prototype.error = error;
Client.prototype.disconnect = disconnect;
Client.prototype.panic = sendPanic;
Client.prototype.sendMessage = sendMessage;

/**
 * EOS UDP client
 *
 * @param settings
 * @constructor
 */
function Client (settings, io) {
    if (!(this instanceof Client)) return new Client(options);

    console.log('settings', settings);
    this.settings = settings || {};
    this.host = this.settings.host || HOST;
    this.port = this.settings.port || PORT;

    // be sure to increment this number after every time you send a packet!
    this.seqNumber = 1;

    // start a webserver
    var app = require('express')();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);

    app.use(require('express').static(settings.path));

    io.on('connection', function(socket){
        console.log('a user connected');
    });

    http.listen(settings.port, function(){
        console.log('emulator listening on http://localhost:' + settings.port);
    });

    this.socket = io;

    // TODO: change to WS implementation
    this.socket.on('message', function (msg, remote) {

        var message = parseMessage(msg);
        //console.log('message', message);
        // init message
        if (message.init) {
            console.log('[WS] message.init', message);
            this.connecting = false;
            this.connected = true;
            // execute the connect call back (if it exists)
            if (this.connectCb) this.connectCb();
            this.emit('connect');
        } else if (message.error) {
            console.log('[WS] message.error', message);
            if (this.errorCb) this.errorCb(message.error);
            this.emit('error', message.error, message.seqNumber);
        } else if (message.ok) {
            // TODO: use the messageCallbacks array
            if (this.okCb) this.okCb();
            this.emit('ok', message.seqNumber);
        }

    }.bind(this));

    //this.connect();


}

/**
 * send a list of PWM values (12 bit) to the server
 *
 * @param pwmValues
 */
function send (pwmValues) {

    this.seqNumber += 1;

    this.sendMessage({
        type  : MESSAGE_HALOGEN,
        value : pwmValues
    });
}

/**
 * send a list of color values to the server (0x0 to 0xFFFFFF), 32-bit longs (first 8 bits not used)
 * @param colorValues
 */
function sendLed (colorValues) {

    // parse color values to a more readable RGB format


    this.seqNumber += 1;

    this.sendMessage({
        type  : MESSAGE_LED,
        value : colorValues.map(color.intToRgb)
    });
}

/**
 * send the actual message to the socket
 * @todo: perhaps do some error checking here? Also check if the client is actually connected. If not, connect it
 * @param message
 */
function sendMessage (message) {
    var that = this;

    if (!this.connected && !this.connecting) {
        console.log('[WS] trying to connect');
        this.connect(function () {
            that.socket.emit('message', message);
        })
    } else {
        this.socket.emit('message', message);
    }
}

/**
 * send a panic message, telling the server to turn all halogen and led lights off
 */
function sendPanic () {

    this.seqNumber += 1;

    this.socket.emit(message, {
        type : MESSAGE_PANIC
    });
}

/**
 * connect to the UDP socket and send the MESSAGE_INIT, checking if we have a proper connection
 * @param cb
 */
function connect (cb) {
    if (this.connecting) {
        console.log('[WS] already connecting!');
        return;
    }

    this.connecting = true;
    this.connectCb = cb;

    this.socket.emit('message', {type : MESSAGE_INIT});

}

function error (cb) {
    this.errorCb = cb;
}

function disconnect () {
    this.connected = false;
    this.socket.close();
}

function parseMessage (message) {

    var ret = {};

    if (message.type === INIT_OK) {
        // OK message!
        console.log('[WS] SERVER INIT OK');
        ret.init = true;
        ret.type = INIT_OK;
    }

    // ERROR MESSAGE
    if (message.type === ERROR_START) {
        console.log('[WS] SERVER ERROR');
        // some error sending stuff!
        // get the sequence encoded number
        // TODO: make this take
        ret.seqNumber = message.seqNumber;
        ret.type = MESSAGE_ERROR;
        ret.error = message.error;
    }

    // OK message
    if (message.type === MESSAGE_OK) {
        //console.log('SERVER OK');
        // message received successfully
        ret.type = MESSAGE_OK;
        ret.ok = true;
        ret.seqNumber = message.seqNumber;
    }

    return ret;
}