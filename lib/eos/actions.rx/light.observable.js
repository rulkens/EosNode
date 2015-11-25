'use strict';
/**
 * Create A light observable with a set of options
 */

var _      = require('lodash'),
    rxUtil = require('../util.rx'),
    noise  = require('../util.noise'),
    Light  = require('../light');

module.exports = lightObservable;

lightObservable.defaults = {
    fps        : 60,
    length     : 10,
    waveLength : 1,

    transform : {
        scale  : 1,
        offset : 0
    },

    envelope : {
        attack  : 2,
        release : 4
    },

    light : {
        intensity : 1,
        position  : {
            base      : 0.5,
            variation : 0,
            speed     : 0.02
        }
    }
};

function lightObservable (options) {
    var o = _.merge({}, lightObservable.defaults, options);

    return rxUtil.wave.sine(o)
        .map(rxUtil.transform.wave.transform(o.transform || {}))
        .map(rxUtil.transform.wave.envelope(o.envelope || {}))
        .map(waveToLight(o.light || {}))
}

/**
 * convert a wave object { i, y } to a Light object
 */
function waveToLight (options) {
    let o = options || {};
    let oPos = o.position || {};

    return function (wave) {
        let n = noise.perlin2(0, wave.x * oPos.speed) * oPos.variation;
        return new Light({intensity : wave.y * (o.intensity || 1), position : (oPos.base || 0.5) + n});
    }
}