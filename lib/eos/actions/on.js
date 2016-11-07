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

module.exports = On;

inherits(On, Action);

On.prototype.step = step;

function On (options) {
    if (!(this instanceof On)) return new On(options);
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
        light : util.emptyArray(numLights).map(() => 1),
        color : util.emptyArray(numColors)
    };
}