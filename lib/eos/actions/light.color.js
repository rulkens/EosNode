/**
 * Moves three lights in opposite direction over the lamp, with different colors
 */
'use strict';

var inherits   = require('inherits'),
    _          = require('lodash'),
    Action     = require('../action'),
    ColorLight = require('../light.color'),
    util       = require('../util');

var defaults = {
    color     : 0xFF,
    speed     : 0.1, // in lights per second
    size      : 5.0,
    intensity : 0.9
};

// TODO: move this somewhere else
var FRAMERATE  = 30,
    NUM_LIGHTS = 32,
    LIGHTS_SEC = FRAMERATE * NUM_LIGHTS;

module.exports = Pong;

inherits(Pong, Action);

Pong.prototype.step = step;

function Pong (options) {
    Action.prototype.constructor.apply(this, arguments);

    _.defaults(this, defaults);
    _.extend(this, options);

    var lightSettings = {
        size      : this.size,
        intensity : this.intensity,
        position  : 1.0,
        direction : -1
        //color     : this.color
    };
    this.light = new ColorLight();
}


function step () {

    var res = this.light.result();
    
    //console.log('res.length', res.length);

    //console.log('lights', res);

    return {color : this.light.result()};
}