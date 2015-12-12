/**
 * Create A sparkles observable with a set of options
 */
'use strict';

var _         = require('lodash'),
    util      = require('../util'),
    colorUtil = require('../util.color'),
    rxUtil    = require('../util.rx'),
    noise     = require('../util.noise'),
    numLights = require('../light.color').defaults.numLights;

module.exports = sparklesObservable;

sparklesObservable.defaults = {
    fps        : 60.0,
    length     : 10.0,
    waveLength : 1.0,
    color      : 0x77FFFF, // color of the sparkle
    chance     : .1 // 0.0001 the chance a sparkle will form in this frame
};

function sparklesObservable (options) {
    let o = _.merge({}, sparklesObservable.defaults, options);

    return rxUtil.loop().map(function (i) {
        // generate array
        return util.range(numLights, 0);
    }).map(function (lights) {
        //console.log('lights.length', lights.length);
        // slight chance of one light turning on
        return lights.map(function (light) {
            if (Math.random() < sparklesObservable.defaults.chance / numLights) {
                return colorUtil.colorToInt(colorUtil.intToColor(sparklesObservable.defaults.color).blackness(Math.random()));
            } else {
                return 0;
            }
        })
    })
}