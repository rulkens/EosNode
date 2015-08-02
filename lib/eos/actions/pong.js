/**
 * Created by rulkens on 29/04/15.
 */
'use strict';
var inherits = require('inherits'),
    _ = require('lodash'),
    Action = require('../action'),
    Light = require('../light'),
    util = require('../util');

var defaults = {
    speed: 2.0, // in lights per second
    size: 5.0,
    intensity: 0.9
};

// TODO: move this somewhere else
var FRAMERATE = 30;
var NUM_LIGHTS = 32;
var LIGHTS_SEC = FRAMERATE * NUM_LIGHTS;

module.exports = Pong;

inherits(Pong, Action);

Pong.prototype.step = step;

function Pong(options) {
    Action.prototype.constructor.apply(this, arguments);

    _.defaults(this, defaults);
    _.extend(this, options);

    var lightSettings = {
        size: this.size,
        intensity: this.intensity
    };
    this.lights = [
        new Light(_.extend({ position: 1.0, direction: -1 }, lightSettings)),
        new Light(_.extend({ position: 0.0, direction:  1 }, lightSettings))
    ];

}

function step() {
    var result = this.lights.map(function(light){
        light.position += light.direction * ( this.speed / LIGHTS_SEC );

        // reverse direction when the light is outside the range
        if(light.position > 1)
            light.direction = -1;
        if(light.position < 0)
            light.direction = 1;

        return light.result();
    }, this);

    return util.sumIlluminances(result);
}