/**
 * Simple analogue clock
 */
var inherits = require('inherits'),
    _        = require('lodash'),
    Action   = require('../action'),
    Light    = require('../light'),
    util     = require('../util'),
    clock    = require('../util.clock');

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
        new Light({intensity : 0.3, size : 7}),
        new Light({intensity : 0.8, size : 6}),
        new Light({intensity : 1.0, size : 4})
    ];
}

/**
 * have three lights move, one for hours, one for minutes and one for seconds
 * @returns {{light: *}}
 */
function step () {

    var hms = clock.hms_sinceMidnight(this.smooth);
    //console.log('hms', clock.msSinceMidnight() - this.oldms);
    this.oldms = clock.msSinceMidnight();
    var result = this.lights.map(function (light, index) {
        light.position = hms[index];
        return light.result();
    });
    return {light : util.sumIlluminances(result)};
}