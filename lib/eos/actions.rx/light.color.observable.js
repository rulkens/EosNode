'use strict';
/**
 * Create A light observable with a set of options
 */

var _          = require('lodash'),
    Rx         = require('rx'),
    util       = require('../util/util'),
    rxUtil     = require('../util/util.rx.js'),
    noise      = require('../util/util.noise.js'),
    ColorLight = require('../light.color'),
    colorUtil  = require('../util/util.color.js');

module.exports = colorLightObservable;

colorLightObservable.defaults = {
    numLights  : ColorLight.defaults.numLights,
    fps        : 60.0,
    //length     : 10.0,
    waveLength : 1.0,

    wave : {
        scale  : 0,
        offset : 1
    },

    // TODO: make sure that when no envelope is selected, the light will stay on forever
    //envelope : {
    //    attack  : 4,
    //    release : 6
    //},

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


// default
colorLightObservable.allLightsOff = util.range(120).map(() => 0);
colorLightObservable.off = off;

function colorLightObservable (options) {
    let o = _.defaultsDeep({}, options, colorLightObservable.defaults);

    console.log('colorLightObservable', o);

    var ret = rxUtil.wave.sine(o)
        .map(rxUtil.transform.wave.transform(o.wave || {}));
    // TODO: conditionally apply

    // TODO: remove this and put it into a different function
    if (o.envelope) {
        ret = ret.map(rxUtil.transform.wave.envelope(o.envelope || {}))
    }

    ret = ret.map(waveToColorLight(o.light || {}));

    if (o.length) {
        ret = ret.take(o.fps * o.length);
        // turn all lights off as the last action we take
        // TODO: create some easier way to turn all lights off
        ret = Rx.Observable.concat(off(), ret)
    }
    return ret;
}

/**
 * convert a wave to a color light
 * @param options
 * @returns {Function}
 */
function waveToColorLight (options) {
    var o = options || {};
    return function (wave) {
        // for now, don't use noise until we have implemented it properly
        //var posNoise = noise.perlin2(0, wave.x * o.position.speed) * o.position.variation,
        //    hueNoise = noise.perlin2(0, (60 + wave.x) * o.hue.speed) * o.hue.variation;

        var hsv = {h : (((o.hue.base + 2) % 1) * 360), s : 70, v : 50},
            c   = o.color ? o.color : colorUtil.hsvToInt(hsv);

        var settings = {
            color     : c,
            intensity : wave.y,
            position  : (o.position.base || 0.5)// + posNoise
        };

        return new ColorLight(settings);
    }
}

/**
 * doesn't work...
 *
 * @returns {*}
 */
function off () {
    var l = new ColorLight({color : 0, intensity : 0});
    return Rx.Observable.just(l);
}