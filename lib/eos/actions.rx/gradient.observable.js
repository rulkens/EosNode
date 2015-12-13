/**
 * Create A rainbow observable
 */
'use strict';

var _         = require('lodash'),
    util      = require('../util/util'),
    colorUtil = require('../util/util.color.js'),
    rxUtil    = require('../util/util.rx.js'),
    noise     = require('../util/util.noise.js'),
    numLights = require('../light.color').defaults.numLights,
    gradients = require('../gradients'),
    Gradient  = colorUtil.Gradient;

module.exports = gradientObservable;

gradientObservable.defaults = {
    fps        : 60,
    waveLength : 10,
    direction  : 'down', //from bottom to top, can be 'up' or 'down'
    scaling    : 1,
    speed      : .5,
    gradient   : gradients.whiteToBlack
};

function gradientObservable (options) {
    var o = _.merge({}, gradientObservable.defaults, options);

    return rxUtil.wave.sawtooth(o)
        .map(function waveToColors(wave) {
            return util
                .range(numLights)
                .map(i => i / numLights)
                .map(function (light, i) {
                    var y = o.direction === 'up' ? 1 - wave.y : wave.y;
                    var pos = (y + i / numLights) % 1; // hue normalized
                    var c = Gradient.getVal(o.gradient, pos);
                    return c;
                })
                // apply color correction
                .map(c => colorUtil.correct(c))
                // apply gamma correction
                .map(c => colorUtil.gamma(c, 2.7))
                // convert back to integer
                .map(colorUtil.colorToInt)
        });
}