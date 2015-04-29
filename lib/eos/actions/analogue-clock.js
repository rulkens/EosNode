/**
 * Created by rulkens on 29/04/15.
 */
var inherits = require('inherits'),
    _ = require('lodash'),
    Action = require('../action'),
    Light = require('../light'),
    util = require('../util'),
    clock = require('./clock.util');

var defaults = {
    smooth: true
};

var AnalogueClock = function (options) {
    Action.prototype.constructor.apply(this, arguments);

    _.defaults(this, defaults);
    _.extend(this, options);

    this.lights = [
        new Light({ intensity: 0.3, size: 7 }),
        new Light({ intensity: 0.8, size: 6 }),
        new Light({ intensity: 1.0, size: 4 })
    ];
};

inherits(AnalogueClock, Action);

AnalogueClock.prototype.step = function () {
    var hms = clock.hms_sinceMidnight(this.smooth);
    console.log('hms', clock.msSinceMidnight() - this.oldms);
    this.oldms = clock.msSinceMidnight();
    var result = this.lights.map(function (light, index) {
        light.position = hms[index];
        return light.result();
    });
    return util.sumIlluminances(result);
};

module.exports = AnalogueClock;