/**
 * higher level API for the EOS lamp
 *
 * TODO: implement most of the actual functionality
 */

var UDPClient = require('./client/udp'),
    util = require('./util'),
    _ = require('lodash'),
    inherits = require('inherits'),
    EventEmitter = require('events').EventEmitter;

var PWM_MIN = 0,
    PWM_MAX = 4095,
    NUM_LIGHTS = 32;

module.exports = Eos;

inherits(Eos, EventEmitter);

Eos.prototype.connect           = connect;
Eos.prototype.error             = error;
Eos.prototype.disconnect        = disconnect;

// API functions
Eos.prototype.allOn             = allOn;
Eos.prototype.allOff            = allOff;
Eos.prototype.one               = one;
Eos.prototype.set               = set;
Eos.prototype.setRaw            = setRaw;
Eos.prototype.all               = all;
Eos.prototype.only              = only;
Eos.prototype.on                = on;
Eos.prototype.off               = off;
Eos.prototype.setFreq           = setFreq;
Eos.prototype.getStatus         = getStatus;
Eos.prototype.setGamma          = setGamma;

function Eos(){
    this.client = new UDPClient();

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

/** ====== API FUNCTIONS ======= **/

/**
 * turn all lights on to full intensity
 * @returns {allOn}
 */
function allOn(){

    this.status = _.range(NUM_LIGHTS).map(function () {
        return 1;
    });

    this.set(this.status);
    return this;
}

/**
 * turn all lights off
 *
 * @returns {allOff}
 */
function allOff(){

    this.status = _.range(NUM_LIGHTS).map(function () {
        return 0;
    });

    this.set(this.status);
    return this;
}

/**
 * turn one light on to the specified intensity, don't do anything with the
 * other lights
 *
 * @param index
 * @param intensity
 * @returns {one}
 */
function one(index, intensity){

    return this;
}

/**
 * set the raw PWM values (0-4095) for the lights
 *
 * @param values
 * @returns {setRaw}
 */
function setRaw(values){
    this.status = values;

    // TODO: move this to a utility function
    this.client.send(this.status);

    return this;
}

/**
 * set the normalized values for the lights
 *
 * @param values
 * @returns {set}
 */
function set(values){
    this.status = _.map(values, _absValue);

    // TODO: move this to a utility function
    this.client.send(this.status);

    return this;
}

/**
 * set all lights to the specified intensity
 *
 * @param intensity
 * @returns {all}
 */
function all(intensity){

    this.status = _.range(NUM_LIGHTS, function () {
        return intensity;
    }).map(_absValue);

    // TODO: move this to a utility function
    this.client.send(this.status);

    return this;
}

/**
 * turn on only light with `index` to `intensity`
 * @todo
 * @param index
 * @param intensity
 * @returns {only}
 */
function only(index, intensity){

    return this;
}

/**
 * @todo
 * @param index
 * @returns {on}
 */
function on(index){

    return this;
}

/**
 * @todo
 * @param index
 * @returns {off}
 */
function off(index){

    return this;
}

/**
 * @todo
 * @param freq
 * @returns {setFreq}
 */
function setFreq(freq){

    this._freq = freq;

    return this;
}

/**
 * @todo
 * @returns {*|number|string}
 */
function getStatus(){
    return this.status;
}

/**
 * @todo
 * @param gamma
 * @returns {setGamma}
 */
function setGamma(gamma){

    this._gamma = gamma;
    // TODO: update gamma

    return this;

}

// UTILITY FUNCTIONS

function _absValue(val){
    return Math.floor(Math.max(PWM_MIN, Math.min(PWM_MAX, val * PWM_MAX)));
}

function _after(f, g){
    return function(){
        f(); g();
    }
}

function _sendStatusAfter (f){
    return _after(f, function(){
        this.client.send();
    })
}