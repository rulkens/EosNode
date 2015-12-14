/**
 * Moves three lights in opposite direction over the lamp, with different colors
 */
'use strict';

var inherits  = require('inherits'),
    _         = require('lodash'),
    Action    = require('../action'),
    Light     = require('../light.color'),
    util      = require('../util/util'),
    colorUtil = require('../util/util.color');

var defaults = {
    colors    : [0xFF, 0xFF00, 0xFF0000],
    speeds    : [0.5, 0.9, 1.2], // in lights per second
    sizes     : [20, 10, 5],
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
        intensity : this.intensity,
    };
    this.lights = [
        new Light(_.extend({
            position  : 1.0,
            direction : -1,
            color     : this.colors[0],
            size      : this.sizes[0]
        }, lightSettings)),
        new Light(_.extend({
            position  : 0.0,
            direction : 1,
            color     : this.colors[1],
            size      : this.sizes[1]
        }, lightSettings)),
        new Light(_.extend({
            position  : 0.5,
            direction : 1,
            color     : this.colors[2],
            size      : this.sizes[2]
        }, lightSettings))
    ];
}

function step () {
    var that = this;
    var result = this.lights.map(function (light, index) {
        light.position += light.direction * ( that.speeds[index] / LIGHTS_SEC );

        // reverse direction when the light is outside the range
        if (light.position > 1)
            light.direction = -1;
        if (light.position < 0)
            light.direction = 1;

        return light.result()//.map(c => colorUtil.correct(c));
    }, this);

    var lights = colorUtil.sumColorArrays(result);

    return {color : lights};
}