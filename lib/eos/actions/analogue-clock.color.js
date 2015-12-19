/**
 * Simple analogue clock
 *
 * It has three lights that move up
 */
var inherits   = require('inherits'),
    _          = require('lodash'),
    Action     = require('../action'),
    ColorLight = require('../light.color'),
    util       = require('../util/util'),
    clock      = require('../util/util.clock.js'),
    colorUtil = require('../util/util.color.js');

module.exports = AnalogueClock;

inherits(AnalogueClock, Action);


AnalogueClock.prototype.step = step;

var defaults = {
    smooth : true
};

function AnalogueClock (options) {
    if (!(this instanceof AnalogueClock)) return new AnalogueClock(options);
    Action.prototype.constructor.apply(this, arguments);

    _.defaults(this, defaults);
    _.extend(this, options);

    this.lights = [
        ColorLight({size : 16, color: 0xFF0000}),   // hours
        ColorLight({size : 10, color: 0x00FF00}),   // minutes
        ColorLight({size : 6, color: 0x0000FF})    // seconds
    ];
}

/**
 * have three lights move, one for hours, one for minutes and one for seconds
 * @returns {{light: *}}
 */
function step () {
    var hms = clock.hms_sinceMidnight(this.smooth);
    //console.log('hms', hms);
    this.oldms = clock.msSinceMidnight();
    var result = this.lights.map(function (light, index) {
        light.position = hms[index];
        return light.result();
    });
    return {color : colorUtil.sumColorArrays()(result)};
}