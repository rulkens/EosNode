/**
 * higher level API emulator for the EOS lamp.
 *
 * This objects starts a simple web server that shows the predicted result
 *
 *
 * TODO: implement most of the actual functionality
 */

var _            = require('lodash'),
    inherits     = require('inherits'),
    EventEmitter = require('events').EventEmitter,
    lightsApi    = require('./api.lights'),
    colorsApi    = require('./api.colors'),
    nodeStatic   = require('node-static'),
    WSClient     = require('./client/websocket'),
    util         = require('./util/util');


var PWM_MIN    = 0,
    PWM_MAX    = 4095,
    NUM_LIGHTS = 32;

module.exports = Eos;

inherits(Eos, EventEmitter);

Eos.prototype.connect = connect;
Eos.prototype.error = error;
Eos.prototype.disconnect = disconnect;
Eos.prototype.panic = panic;

function Eos (settings) {
    if (!(this instanceof Eos)) return new Eos(settings);
    
    // initialize the websocket client

    this.client = new WSClient(settings.ws, io);
    this.lights = new lightsApi({client : this.client});
    this.colors = new colorsApi({client : this.client});

    // re-emit events
    // TODO: write a function for this
    this.client.on('connect', function () {
        this.connected = true;
        this.emit('connect');
    }.bind(this));

    this.client.on('disconnect', function () {
        this.connected = false;
        this.emit('disconnect');
    }.bind(this));

    this.client.on('ok', function (seqNumber) {
        this.emit('data', this.status, seqNumber);
    }.bind(this));

    this.client.on('error', function (error, seqNumber) {
        this.emit('error', error, seqNumber)
    }.bind(this));

    /*
     this.client.connect(function () {
     console.log('connected!');
     });
     */

    
}

function connect (cb) {
    var that = this;
    this.client.connect(callback);

    return this;

    // we provide an intermediate callback to return ourselves
    function callback () {
        return cb(that);
    }
}

function disconnect () {
    this.client.disconnect();
    return this;
}

function error (cb) {
    this.client.error(cb);
    return this;
}

function panic () {
    this.client.panic();
    return this;
}