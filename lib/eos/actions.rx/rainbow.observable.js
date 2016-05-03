/**
 * Create A rainbow observable
 */
'use strict';

var _         = require('lodash'),
    util      = require('../util/util'),
    colorUtil = require('../util/util.color.js'),
    rxUtil    = require('../util/util.rx.js'),
    noise     = require('../util/util.noise.js'),
    numLights = require('../light.color').defaults.numLights;

module.exports = rainbowObservable;

rainbowObservable.defaults = {
    fps        : 60,
    waveLength : 2,
    direction  : 'up', //from bottom to top, can be 'up' or 'down'
    scaling    : 1,
    intensity  : 1,
    saturation : 1
};

function rainbowObservable (options) {
    var o = _.merge({}, rainbowObservable.defaults, options);

    return rxUtil.wave.sawtooth(o)
        .map(function (wave) {
            //console.log('wave', wave);
            var lights = util.range(numLights);

            return lights.map(function (light, i) {
                var y = o.direction === 'up' ? 1 - wave.y : wave.y;
                var hueNorm = (y + (o.scaling * i) / numLights) % 1; // hue normalized
                var c = colorUtil.Color({h : hueNorm * 360, s : 100 * o.saturation, v : 100 * o.intensity});
                return colorUtil.colorToInt(c);
            });
        });
}