/**
 * Created by rulkens on 29/04/15.
 */
'use strict';
var inherits = require('inherits'),
    _ = require('lodash'),
    Action = require('../action'),
    Light = require('../light');

var defaults = {
    speed: 2.0, // in lights per second
    direction: 1,
    size: 3.0,
    intensity: 0.4
};

// TODO: move this somewhere else
var FRAMERATE = 60.0;
var NUM_LIGHTS = 32;
var LIGHTS_SEC = FRAMERATE * NUM_LIGHTS;

var Pong = function (options) {
    Action.prototype.apply(this, arguments);

    _.defaults(this, defaults);
    _.extend(this, options);

    this.light = new Light({
        size: this.size,
        intensity: this.intensity
    });
};

inherits(Pong, Action);

Pong.prototype.step = function () {
    console.log('Step in Pong');
    this.light.position += this.direction * ( this.speed / LIGHTS_SEC );
    return this.light.result();
};

module.exports = Pong;