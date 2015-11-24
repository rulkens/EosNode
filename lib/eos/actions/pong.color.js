/**
 * Moves three lights in opposite direction over the lamp, with different colors
 */
'use strict';

var inherits = require('inherits'),
    _        = require('lodash'),
    Action   = require('../action'),
    Light    = require('../light.color'),
    util     = require('../util');

var defaults = {
    colors    : [0xFF, 0xFF00, 0xFF0000],
    speeds    : [0.1, 0.2, 0.3], // in lights per second
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

function Pong(options) {
    Action.prototype.constructor.apply(this, arguments);

    _.defaults(this, defaults);
    _.extend(this, options);

    var lightSettings = {
        size: this.size,
        intensity: this.intensity,
    };
    this.lights = [
        new Light(_.extend({ position: 1.0, direction: -1, color: this.colors[0] }, lightSettings)),
        new Light(_.extend({ position: 0.0, direction:  1, color: this.colors[1] }, lightSettings)),
        new Light(_.extend({ position: 0.5, direction:  1, color: this.colors[2] }, lightSettings))
    ];
}

function step() {
    var that = this;
    var result = this.lights.map(function(light, index){
        light.position += light.direction * ( that.speeds[index] / LIGHTS_SEC );

        // reverse direction when the light is outside the range
        if(light.position > 1)
            light.direction = -1;
        if(light.position < 0)
            light.direction = 1;

        return light.result();
    }, this);

    var lights = colorUtil.sumColorArrays(result);

    //console.log('lights', lights);

    return {light: lights };
}