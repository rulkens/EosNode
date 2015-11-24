/**
 * Simple bouncing light
 */
var inherits = require('inherits'),
    _        = require('lodash'),
    Action   = require('../action'),
    Light    = require('../light'),
    util     = require('../util'),
    clock    = require('../util.clock');

var defaults = { interval : 10000 /* in ms */ };

module.exports = Bounce;
inherits(Bounce, Action);
Bounce.prototype.step = step;

function Bounce (options) {
    Action.prototype.constructor.apply(this, arguments);

    _.defaults(this, defaults);
    _.extend(this, options);

    this.light = new Light({intensity : 0.8, size : 7, position : .5 });
}

function step () {
    var ms = clock.msSinceMidnight(),
        pos = ((ms % this.interval) / this.interval),
        lightPos = pos < .5 ? pos * 2 : 1 - ((pos - .5) * 2);

    this.light.position = lightPos;
    //console.log('pos', pos);
    //console.log('light.position', this.light.position);
    var result = this.light.result();
    return {light : result};
}