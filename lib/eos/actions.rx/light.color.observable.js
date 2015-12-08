'use strict';
/**
 * Create A light observable with a set of options
 */

var _          = require('lodash'),
    rxUtil     = require('../util.rx'),
    noise      = require('../util.noise'),
    ColorLight = require('../light.color'),
    colorUtil  = require('../util.color');

module.exports = colorLightObservable;

colorLightObservable.defaults = {
    fps        : 60.0,
    length     : 10.0,
    waveLength : 1.0,

    transform : {
        scale  : 1,
        offset : 0
    },

    // TODO: make sure that when no envelope is selected, the light will stay on forever
    envelope : {
        attack  : 4.0,
        release : 6.0
    },

    light : {
        color    : 0xFF0000,
        hue      : {
            base      : 0.5,
            variation : 0.2,
            speed     : 0.5
        },
        position : {
            base      : 0.5,
            variation : 0,
            speed     : .012
        }
    }
};

function colorLightObservable (options) {
    let o = _.merge({}, colorLightObservable.defaults, options);

    return rxUtil.wave.sine(o)
        .map(rxUtil.transform.wave.transform(o.transform || {}))
        // TODO: conditionally apply
        .map(rxUtil.transform.wave.envelope(o.envelope || {}))
        .map(waveToColorLight(o.light || {}))
}

/**
 * convert a wave to a color light
 * @param options
 * @returns {Function}
 */
function waveToColorLight (options) {
    var o = options || {};
    return function (wave) {
        var posNoise = noise.perlin2(0, wave.x * o.position.speed) * o.position.variation,
            hueNoise = noise.perlin2(0, (60 + wave.x) * o.hue.speed) * o.hue.variation,
            hsv      = {h : (((o.hue.base + hueNoise + 2) % 1) * 360), s : 70, v : 50},
            c        = colorUtil.hsvToInt(hsv);

        var settings = {
            color     : c,
            intensity : wave.y,
            position  : (o.position.base || 0.5) + posNoise
        };

        return new ColorLight(settings);
    }
}