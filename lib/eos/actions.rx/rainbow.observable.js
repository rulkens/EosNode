/**
 * Create A rainbow observable
 */
'use strict';

var _         = require('lodash'),
    util      = require('../util'),
    colorUtil = require('../util.color'),
    rxUtil    = require('../util.rx'),
    noise     = require('../util.noise'),
    numLights = require('../light.color').defaults.numLights;

module.exports = rainbowObservable;

rainbowObservable.defaults = {
    fps        : 60,
    waveLength : 2,
    direction  : 'down', //from bottom to top, can be 'up' or 'down'
    scaling    : 1,
    speed      : .5
};

function rainbowObservable (options) {
    var o = _.merge({}, rainbowObservable.defaults, options);

    return rxUtil.wave.sawtooth(o)
        .map(function (wave) {
            //console.log('wave', wave);
            var lights = util.range(numLights);

            return lights.map(function (light, i) {
                //var y = o.direction === 'up' ? 1 - wave.y : wave.y;
                var hueNorm = (wave.y + i / numLights) % 1; // hue normalized
                var c = colorUtil.Color({h : hueNorm * 360, s : 100, v : 50});
                return colorUtil.colorToInt(c);
            });
        });
}