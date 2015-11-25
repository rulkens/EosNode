'use strict';
/**
 * Created by rulkens on 25/11/15.
 */
var _         = require('lodash'),
    Rx        = require('rx'),
    util      = require('./util'),
    colorUtil = require('./util.color');

module.exports = {
    loop          : loop,
    animation     : animation,
    combineLights : combineLights,
    combineColors : combineColors,

    wave : {
        sawtooth : sawtoothWave,
        sine     : sineWave
    },

    transform : {
        wave : {
            envelope  : envelopeTransform,
            transform : waveTransform
        }
    },

    generator : {
        sawtooth : sawtoothGenerator,
        sine     : sineGenerator
    }
};

const DEFAULTS = {
    FPS         : 60.0,
    WAVE_LENGTH : 1.0,
    SCALE       : 1.0,
    OFFSET      : 0.0
};

/**
 * an endless loop with a specified frames per second
 * @param fps
 * @returns {Observable<number>}
 */
function loop (fps) {
    return Rx.Observable.interval(1000 / (fps || DEFAULTS.FPS));
}

/**
 * a fixed length animation
 *
 * @param fps
 * @param length
 * @returns {Rx.Observable}
 */
function animation (options) {
    let o = options || {};
    var a = (o.loop || loop(o.fps));

    if (o.length) {
        // TODO: find a good way to implement defaults, so we don't have to repeat them
        a = a.take(o.length * (o.fps || DEFAULTS.FPS));
    }
    // if a delay is specified, start later, but emit a first value
    if (o.delay) {
        a = a.delay(o.delay * 1000).startWith(0);
    }
    return a;
}

/**
 * generates an observable that is composed of multiple observables
 */
function combineLights (observables) {
    return observables.reduce((memo, o) => {
        memo = memo ? memo.combineLatest(o, (t, o) => util.sumIlluminances([t, o])) : o;
        return memo;
    });
}

function combineColors (observables) {
    return observables.reduce((memo, o) => {
        memo = memo ? memo.combineLatest(o, (t, o) => colorUtil.sumColorArrays([t, o])) : o;
        return memo;
    });
}

/**
 * an observable that emits a sawtooth wave
 *
 * @param loop
 * @param waveLength
 * @returns {Rx.Observable}
 */
function sawtoothWave (options) {
    let o = options || {};
    return (o.loop || animation(options))
        .map(sawtoothGenerator({waveLength : o.waveLength || DEFAULTS.WAVE_LENGTH, fps : o.fps || DEFAULTS.FPS}))
}

/**
 * an observable that emits a sine wave
 * @param loop
 * @param options
 * @returns {*}
 */
function sineWave (options) {
    let o = options || {};
    return (o.loop || animation(options))
        .map(sineGenerator({waveLength : o.waveLength || DEFAULTS.WAVE_LENGTH, fps : o.fps || DEFAULTS.FPS}))
}
/**
 * generates a square wave with a specific length
 *
 * the output values are normalized [0-1]
 * @param waveLength
 * @param fps
 * @returns {Function}
 */
function sawtoothGenerator (options) {
    var o = options || {};
    return function (i) {
        return {
            i      : i,
            x      : i / o.fps,
            y      : (i / o.waveLength % o.fps) / o.fps,
            length : o.length
        }
    }
}

/**
 * generates a sine wave with a specific length
 *
 * the output values are normalized [0-1]
 *
 * @param waveLength
 * @param fps
 * @returns {Function}
 */
function sineGenerator (options) {
    var o = options || {};
    return function (i) {
        return {
            i      : i,
            x      : i / o.fps,
            y      : .5 - .5 * Math.cos((i / o.waveLength % o.fps) / o.fps * Math.PI * 2),
            length : o.length
        }
    }
}

/**
 *
 * @param attack
 * @param release
 * @param total
 * @returns {Function<Wave>}
 */
function envelopeTransform (options) {
    var o = options || {};
    return function (wave) {
        let y = (wave.x < o.attack) // attack
            ? wave.y * (wave.x / o.attack)
            : (wave.x > wave.length - o.release)  // release
            ? wave.y * ((wave.length - wave.x) / o.release)
            : wave.y;
        return _.merge({}, wave, {
            y : y
        });
    }
}

/**
 * can transform with options { scale = 1, offset = 0 }
 * @param options
 * @returns {Function<Wave>}
 */
function waveTransform (options) {
    let o = options || {};
    return function (wave) {
        return _.merge({}, wave, {
            y : (wave.y * o.scale) + o.offset
        });
    }
}