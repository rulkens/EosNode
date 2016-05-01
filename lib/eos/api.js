/**
 * higher level API for the EOS lamp
 *
 * TODO: implement most of the actual functionality
 */

var util = require('./util/util'),
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
    if (!(this instanceof Eos)) return new Eos(settings);

    if(settings.client === 'udp'){
        this.client = new (require('./client/udp'))(settings.udp);
    } else if(settings.client === 'tcp'){
        this.client = new (require('./client/tcp'))(settings.tcp);
    } else if(settings.client === 'emulator'){
        this.client = new (require('./client/emulator'))(settings.emulator);
    } else {
        // default is UDP
        this.client = new (require('./client/udp'))(settings.udp);
    }
    
    this.lights = new lightsApi({ client: this.client });
    this.colors = new colorsApi({ client: this.client });

    // re-emit events
    // TODO: write a function for this
    this.client.on('connect', function(){
        this.connected = true;
        this.emit('connect');
    }.bind(this));

    this.client.on('disconnect', function(){
        this.connected = false;
        this.emit('disconnect');
    }.bind(this));

    this.client.on('ok', function(seqNumber){
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

function connect(cb){
    var that = this;
    this.client.connect(callback);

    return this;

    // we provide an intermediate callback to return ourselves
    function callback(){
        return cb(that);
    }
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