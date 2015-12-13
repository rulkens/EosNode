/**
 * Moves three lights in opposite direction over the lamp, with different colors
 */
'use strict';

var inherits   = require('inherits'),
    _          = require('lodash'),
    Action     = require('../action'),
    ColorLight = require('../light.color'),
    util       = require('../util/util'),
    colorApi = require('../api.colors');

var defaults = {
    color     : 0xFF,
    //speed     : 0.1, // in lights per second
    size      : 40.0,
    intensity : 0.9
};

// TODO: move this somewhere else
var FRAMERATE  = 30,
    LIGHTS_SEC = FRAMERATE * colorApi.NUM_LIGHTS;

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
        position  : 0.5,
        direction : -1,
        color     : this.color
    };
    this.light = new ColorLight(lightSettings);
}


function step () {

    //var res = this.light.result();
    
    //console.log('res.length', res.length);

    //console.log('lights', res);
    //console.log('this.light.result()', this.light.result(), 'length: ' + this.light.result().length);

    return {color : this.light.result()};
}