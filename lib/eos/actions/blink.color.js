/**
 * Simple blink, color version
 *
 * parameters:
 * * interval
 */
var inherits   = require('inherits'),
    _          = require('lodash'),
    Action     = require('../action'),
    ColorLight = require('../light.color'),
    util       = require('../util/util'),
    clock      = require('../util/util.clock.js'),
    colorApi   = require('../api.colors');

var defaults = {
    interval    : 2000, /* in ms */
    color       : 0xFF0000,
    cycleColors : [0xFF, 0xFF00, 0xFF0000],
    mode        : 'cycle'
};

module.exports = Blink;
inherits(Blink, Action);
Blink.prototype.step = step;

function Blink (options) {
    Action.prototype.constructor.apply(this, arguments);

    _.defaults(this, defaults);
    _.extend(this, options);

    this.light = new ColorLight({intensity : 0.3, size : 7, position : .5});
}

function step () {
    var color    = this.color,
        ms       = clock.msSinceMidnight(),
        normTime = (ms % this.interval) / this.interval,
        on       = (normTime > .5) ? 1 : 0;

    if (this.mode === 'color') {
        return {
            color : util.emptyArray(colorApi.NUM_LIGHTS).map(function (elem, index) {
                return color * on;
            })
        };
    } else if (this.mode === 'cycle') {
        var selectedIndex = Math.floor(normTime * this.cycleColors.length),
            selectedColor = this.cycleColors[selectedIndex];
        return {
            color : util.emptyArray(colorApi.NUM_LIGHTS).map(function (elem, index) {
                return selectedColor;
            })
        };
    }

}