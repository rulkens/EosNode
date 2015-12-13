/**
 * higher level API for the EOS lamp
 *
 * TODO: implement most of the actual functionality
 */

var UDPClient = require('./client/udp'),
    util = require('./util/util'),
    _ = require('lodash'),
    inherits = require('inherits'),
    EventEmitter = require('events').EventEmitter,
    lightsApi = require('./api.lights'),
    colorsApi = require('./api.colors');

var PWM_MIN = 0,
    PWM_MAX = 4095,
    NUM_LIGHTS = 32;

module.exports = Eos;

inherits(Eos, EventEmitter);

Eos.prototype.connect           = connect;
Eos.prototype.error             = error;
Eos.prototype.disconnect        = disconnect;
Eos.prototype.panic             = panic;

function Eos(settings){
    this.client = new UDPClient(settings.udp);
    this.lights = new lightsApi({ client: this.client });
    this.colors = new colorsApi({ client: this.client });

    // re-emit events
    // TODO: write a function for this
    this.client.on('connect', function(){
        this.emit('connect');
    }.bind(this));

    this.client.on('ok', function(seqNumber){
        this.emit('data', this.status, seqNumber);
    }.bind(this));

    this.client.on('error', function (error, seqNumber) {
        this.emit('error', error, seqNumber)
    }.bind(this));
}

function connect(cb){
    this.client.connect(cb);
    return this;
}

function disconnect(){
    this.client.disconnect();
    return this;
}

function error(cb) {
    this.client.error(cb);
    return this;
}

function panic (){
    this.client.panic();
    return this;
}