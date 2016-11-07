/**
 * EOS Touch Client
 */
'use strict';

var dgram        = require('dgram'),
    inherits     = require('inherits'),
    EventEmitter = require('events').EventEmitter,
    _            = require('lodash');

// default host and port
var HOST = '127.0.0.1',//HOST = '192.168.3.51', // TODO: make this dynamic
    PORT = 5158;

// messages
var INIT        = 'INIT',
    INIT_OK     = 'INIT_OK',
    OK          = 'OK',
    TAP         = 'TAP',
    DOUBLE_TAP  = 'DOUBLE_TAP',
    TOUCH_START = 'TOUCH_START',
    TOUCH_END   = 'TOUCH_END',
    SET_STATE   = 'SET_STATE',
    ERROR       = 'ERROR';

// states
var STATES = {
	'SETUP'       : 0,
	'STARTUP'     : 1,
	'OK'          : 2,
	'ERROR'       : 3,
	'PROG_RUN'    : 4,
	'TOUCH'       : 10,
	'TOUCH_LONG'  : 11,
	'TOUCH_XLONG' : 12
}

module.exports = Client;

inherits(Client, EventEmitter);

Client.prototype.connect    = connect;
Client.prototype.error      = error;
Client.prototype.disconnect = disconnect;
Client.prototype.send       = send;
Client.prototype.setState   = setState;
Client.STATES = STATES;

/**
 * EOS UDP client
 *
 * @param settings
 * @constructor
 */
function Client (settings) {
	if (!(this instanceof Client)) return new Client(options);

	console.log('settings', settings);
	this.settings = settings || {};
	this.host     = this.settings.host || HOST;
	this.port     = this.settings.port || PORT;

	// be sure to increment this number after every time you send a packet!
	this.seqNumber = 1;

	this.messageCallbacks = [];

	this.socket = new dgram.createSocket('udp4');

	this.socket.on('message', function (msg, remote) {

		//console.log('message', msg);
		var message = parseMessage(msg);
		//console.log('message', message);
		// init message
		if (message === INIT_OK) {
			console.log('[TOUCH] message.init ok', message);
			this.connecting = false;
			this.connected  = true;
			// execute the connect call back (if it exists)
			if (this.connectCb) this.connectCb();
			this.emit('connect');
		} else if (message === ERROR) {
			console.log('[TOUCH] message.error', message);
			if (this.errorCb) this.errorCb(message);
			this.emit('error', message);
		} else if (message === OK) {
			// TODO: use the messageCallbacks array
			if (this.okCb) this.okCb();
			this.emit('ok');
		} else if (message === TAP) {
			this.emit('tap');
		} else if (message === DOUBLE_TAP) {
			this.emit('doubleTap')
		} else if (message === TOUCH_START) {
			this.emit('touchStart')
		} else if (message === TOUCH_END) {
			this.emit('touchEnd')
		}

	}.bind(this));

	//this.connect();
}

/**
 * send the actual message to the socket
 * @todo: perhaps do some error checking here? Also check if the client is actually connected. If not, connect it
 * @param message
 */
function send (message) {
	var that = this;

	if (!this.connected && !this.connecting) {
		console.log('[TOUCH] trying to connect');
		this.connect(function () {
			that.socket.send(message, 0, message.length, that.port, that.host);
		})
	} else {
		this.socket.send(message, 0, message.length, this.port, this.host);
	}
}

function setState (state) {
	this.send([SET_STATE, state].join(' '));
}


/**
 * connect to the UDP socket and send the MESSAGE_INIT, checking if we have a proper connection
 * @param cb
 */
function connect (cb) {
	if (this.connecting) {
		console.log('[TOUCH] already connecting!');
		return;
	}

	this.connecting = true;
	this.connectCb  = cb;

	var initMessage = new Buffer(INIT);

	this.socket.send(initMessage, 0, initMessage.length, this.port, this.host, function (err, bytes) {
		console.log('[TOUCH] CONNECT INFO SENT TO: ' + this.host + ':' + this.port);
		//console.log('bytes sent', bytes);

	}.bind(this));
}

function error (cb) {
	this.errorCb = cb;
}

function disconnect () {
	this.connected = false;
	this.socket.close();
}

function parseMessage (msg) {
	return msg.toString('ascii');
}