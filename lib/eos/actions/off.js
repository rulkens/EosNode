/**
 * just turn all lights off
 */
'use strict';

var inherits  = require('inherits'),
    _         = require('lodash'),
    Action    = require('../action'),
    util      = require('../util/util'),
    numLights = require('../api.lights').NUM_LIGHTS,
    numColors = require('../api.colors').NUM_LIGHTS;

var defaults = {
    executedOnce : false
};

module.exports = Off;

inherits(Off, Action);

Off.prototype.step = step;

function Off (options) {
    if (!(this instanceof Off)) return new Off(options);
    Action.prototype.constructor.apply(this, arguments);

    _.defaults(this, defaults);
    _.extend(this, options);
}

function step () {

    // stop executing after one execution, turning all lights off once
    // is more than enough
    if(this.executedOnce) this.emit('end');

    this.executedOnce = true;


    return {
        light : util.emptyArray(numLights),
        color : util.emptyArray(numColors)
    };
}