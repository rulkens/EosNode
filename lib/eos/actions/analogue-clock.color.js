/**
 * Simple analogue clock
 */
var inherits   = require('inherits'),
    _          = require('lodash'),
    Action     = require('../action'),
    ColorLight = require('../light.color'),
    util       = require('../util'),
    clock      = require('../util.clock'),
    colorUtil = require('../util.color');

module.exports = AnalogueClock;

inherits(AnalogueClock, Action);


AnalogueClock.prototype.step = step;

var defaults = {
    smooth : true
};

function AnalogueClock (options) {
    Action.prototype.constructor.apply(this, arguments);

    _.defaults(this, defaults);
    _.extend(this, options);

    this.lights = [
        new ColorLight({size : 16, color: 0xFF0000}),
        new ColorLight({size : 18, color: 0x00FF00}),
        new ColorLight({size : 20, color: 0x0000FF})
    ];
}

/**
 * have three lights move, one for hours, one for minutes and one for seconds
 * @returns {{light: *}}
 */
function step () {
    var hms = clock.hms_sinceMidnight(this.smooth);
    console.log('hms', hms);
    this.oldms = clock.msSinceMidnight();
    var result = this.lights.map(function (light, index) {
        light.position = hms[index];
        return light.result();
    });
    return {color : colorUtil.sumColorArrays(result)};
}