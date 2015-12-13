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

module.exports = swipeObservable;

swipeObservable.defaults = {
    fps        : 60,
    length     : 1, // time it takes to swipe from top to bottom
    waveLength : 1,
    color      : 0x77FFFF, // color of the sparkle
    direction  : 'up', //from bottom to top, can be 'up' or 'down'
    size       : 1,
    type       : 'sawtooth',
    fade       : true
};

function swipeObservable (options) {
    var o = _.merge({}, swipeObservable.defaults, options);

    return rxUtil.wave[o.type](o)
        .map(function (wave) {
            console.log('wave', wave);
            var lights = util.range(numLights).map(() => 0);

            // calculate the appropriate color
            var c = colorUtil.intToColor(o.color);
            if (o.fade) {
                c = c.darken(wave.y);
                console.log('c', c);
            }
            return lights.map(function (light, i) {
                var pos = o.direction == 'up' ? i : numLights - i;
                var isOn = Math.abs((pos / numLights) - wave.y) > o.size / numLights;
                return isOn ? 0 : colorUtil.colorToInt(c);
            });
        });
}