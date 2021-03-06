/**
 * Create A sparkles observable with a set of options
 */
'use strict';

var _         = require('lodash'),
    util      = require('../util/util'),
    colorUtil = require('../util/util.color.js'),
    rxUtil    = require('../util/util.rx.js'),
    noise     = require('../util/util.noise.js'),
    Gradient  = require('../util/util.color').Gradient,
    numLights = require('../light.color').defaults.numLights;

module.exports = sparklesObservable;

sparklesObservable.defaults = {
    fps        : 60.0,
    length     : 10.0,
    waveLength : 1.0,
    color      : 0xFFFFFF, // color of the sparkle
    chance     : .1 // 0.0001 the chance a sparkle will form in this frame
    // palette : [0x0, 0xFFFFFF] // a palette to use instead of just a color
};

function sparklesObservable (options) {
    var o = _.merge({}, sparklesObservable.defaults, options);

    return rxUtil.loop().map(function (i) {
        // generate array
        return util.range(numLights);
    }).map(function (lights) {
        //console.log('lights.length', lights.length);
        // slight chance of one light turning on
        return lights
            .map(function (light) {
                if (Math.random() < o.chance / numLights) {
                    if (o.palette) {
                        return Gradient.getVal(o.palette, Math.random());
                    } else {
                        return colorUtil.intToColor(o.color).blackness(Math.random());
                    }
                } else {
                    return colorUtil.intToColor(0);
                }
            })
            // convert back to integer
            .map(colorUtil.colorToInt)
    })
}