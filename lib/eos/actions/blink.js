/**
 * Simple blink
 */
var inherits = require('inherits'),
    _        = require('lodash'),
    Action   = require('../action'),
    Light    = require('../light'),
    util     = require('../util'),
    clock    = require('../util.clock');

var defaults = { interval : 2000 /* in ms */ };

module.exports = Blink;
inherits(Blink, Action);
Blink.prototype.step = step;

function Blink (options) {
    Action.prototype.constructor.apply(this, arguments);

    _.defaults(this, defaults);
    _.extend(this, options);

    this.light = new Light({intensity : 0.3, size : 7, position : .5 });
}

function step () {
    var ms = clock.msSinceMidnight();
    this.light.intensity = ((ms % this.interval) / this.interval) > .5 ? 1 : 0;
    console.log('light.intensity', this.light.intensity);
    var result = this.light.result();
    return {light : result};
}