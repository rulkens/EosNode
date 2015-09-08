/**
 * higher level API for the EOS lamp LED color lights
 *
 * TODO: implement most of the actual functionality
 */

var UDPClient = require('./client/udp'),
    util = require('./util'),
    _ = require('lodash'),
    inherits = require('inherits'),
    EventEmitter = require('events').EventEmitter;

var COLOR_MIN = 0,
    COLOR_MAX = 4095,
    NUM_LIGHTS = 120;

module.exports = Api;

inherits(Api, EventEmitter);

// API functions
Api.prototype.allOn             = allOn;
Api.prototype.allOff            = allOff;
Api.prototype.one               = one;
Api.prototype.set               = set;
Api.prototype.all               = all;
Api.prototype.only              = only;
Api.prototype.on                = on;
Api.prototype.off               = off;
Api.prototype.getStatus         = getStatus;
Api.prototype.setGamma          = setGamma;

function Api(settings){
    this.client = settings.client || new UDPClient(settings.udp);
}

/** ====== API FUNCTIONS ======= **/

/**
 * turn all lights on to full intensity
 * @returns {allOn}
 */
function allOn(){

    this.status = _.range(NUM_LIGHTS).map(function () {
        return 0xFFFFFF;
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
 * set the color values for the leds
 *
 * @param values
 * @returns {set}
 */
function set(values){
    this.status = values;

    // TODO: move this to a utility function
    this.client.sendLed(this.status);

    return this;
}

/**
 * set all lights to the specified color
 *
 * @param intensity
 * @returns {all}
 */
function all(color){

    this.status = _.range(NUM_LIGHTS, function () {
        return color;
    });

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
    console.warn('not implemented');
    return this;
}

/**
 * @todo
 * @param index
 * @returns {on}
 */
function on(index){
    console.warn('not implemented');
    return this;
}

/**
 * @todo
 * @param index
 * @returns {off}
 */
function off(index){
    console.warn('not implemented');

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
    console.warn('not implemented');
    this._gamma = gamma;
    // TODO: update gamma

    return this;

}

function panic (){
    this.client.panic();
    return this;
}

// UTILITY FUNCTIONS

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