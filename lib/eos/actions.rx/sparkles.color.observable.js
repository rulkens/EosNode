/**
 * Create A sparkles observable with a set of options
 */
'use strict';

var _         = require('lodash'),
    util      = require('../util'),
    colorUtil = require('../util.color'),
    rxUtil    = require('../util.rx'),
    noise     = require('../util.noise'),
    Light     = require('../light'),
    numLights = require('../light.color').defaults.numLights;

module.exports = sparklesObservable;

sparklesObservable.defaults = {
    fps        : 60.0,
    length     : 10.0,
    waveLength : 1.0,
    color      : 0x77FFFF, // color of the sparkle
    chance     : .001 // 0.0001
};

function sparklesObservable (options) {
    let o = _.merge({}, sparklesObservable.defaults, options);

    return rxUtil.loop().map(function (i) {
        // generate array
        return util.range(numLights).map(function () {
            return 0;
        })
    }).map(function (lights) {
        // slight chance of one light turning on
        return lights.map(function (light) {
            if (Math.random() < sparklesObservable.defaults.chance) {
                return colorUtil.colorToInt(colorUtil.intToColor(sparklesObservable.defaults.color).blackness(Math.random()));
            } else {
                return 0;
            }
        })
    })
}