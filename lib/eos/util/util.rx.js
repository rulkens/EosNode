/**
 * Created by rulkens on 25/11/15.
 */

'use strict';

var _         = require('lodash'),
    Rx        = require('rx'),
    util      = require('./util'),
    colorUtil = require('./util.color.js');

module.exports = {
    loop          : loop,
    randomLoop    : randomLoop,
    animation     : animation,
    combineLights : combineLights,
    combineColors : combineColors,
    toHashes      : toHashes,

    wave : {
        sawtooth : sawtoothWave,
        sine     : sineWave,
        constant : constantWave,
        triangle : triangleWave,
        block    : blockWave
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
    FPS         : 60.0, // default frames per second
    WAVE_LENGTH : 1.0,  // in sec

    SCALE       : 1.0,
    OFFSET      : 0.0,
    BLOCK_RATIO : 0.5 // in block wave, the part that is high
};

/**
 * an endless loop with a specified frames per second
 * @param fps
 * @returns {Observable<number>}
 */
function loop (fps) {
    return Rx.Observable.interval(1000 / (_.isNumber(fps) ? fps : DEFAULTS.FPS));
}

/**
 * @todo implement
 * @param options
 */
function randomLoop (options) {
    let o = options || {};
    throw new Error('not implemented!');

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
 *
 * @param observables
 * @returns {Rx.Observable}
 */
function combineLights (observables) {
    return combineLatestWith(observables, util.sumIlluminances);
}

/**
 * generates an observable that is composed of multiple observables
 *
 * @param observables
 * @returns {Rx.Observable}
 */
function combineColors (observables, blendMode) {
    console.log('[combineColors] blendMode', blendMode);
    return combineLatestWith(observables, colorUtil.sumColorArrays(blendMode));
}

function combineLatestWith (observables, f) {
    return observables.reduce((memo, o) => {
        memo = memo ? memo.combineLatest(o, (t, o) => f([t, o])) : o;
        return memo;
    });
}

/**
 * an observable that emits a sawtooth wave
 *
 * @param {waveLength, fps} options
 * @returns {Rx.Observable}
 */
function sawtoothWave (options) {
    let o = options || {};
    return (o.loop || animation(options))
        .map(sawtoothGenerator({waveLength : o.waveLength || DEFAULTS.WAVE_LENGTH, fps : o.fps || DEFAULTS.FPS}))
}

/**
 * an observable that emits a sine wave
 * @param {waveLength, fps} options
 * @returns {Rx.Observable}
 */
function sineWave (options) {
    let o = options || {};
    return (o.loop || animation(options))
        .map(sineGenerator({waveLength : o.waveLength || DEFAULTS.WAVE_LENGTH, fps : o.fps || DEFAULTS.FPS}))
}

/**
 * an observable that emits a constant value
 * @param {value, fps} options
 * @returns {Rx.Observable}
 */
function constantWave (options) {
    let o = options || {};
    return (o.loop || animation(options))
        .map(constantGenerator({value : o.value || 0, fps : o.fps || DEFAULTS.FPS}))
}

/**
 * an observable that emits a triangle wave
 * @param {waveLength, fps} options
 * @returns {Rx.Observable}
 */
function triangleWave (options) {
    let o = options || {};
    return (o.loop || animation(options))
        .map(triangleGenerator({waveLength : o.waveLength || DEFAULTS.WAVE_LENGTH, fps : o.fps || DEFAULTS.FPS}))
}

/**
 * an observable that emits a block wave
 * @param {waveLength, fps} options
 * @returns {Rx.Observable}
 */
function blockWave (options) {
    let o = options || {};
    return (o.loop || animation(options))
        .map(blockGenerator({
            ratio      : o.ratio || DEFAULTS.BLOCK_RATIO,
            waveLength : o.waveLength || DEFAULTS.WAVE_LENGTH,
            fps        : o.fps || DEFAULTS.FPS
        }))
}

// GENERATORS

/**
 * generates a sawtooth wave with a specific length
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
 * generates a wave with a constant y value
 */
function constantGenerator (options) {
    var o = options || {};
    return function (i) {
        return {
            i      : i,
            x      : i / o.fps,
            y      : options.value,
            length : o.length
        }
    }
}

/**
 * generates a triangle wave with a specific length
 *
 * the output values are normalized [0-1]
 *
 * @param waveLength
 * @param fps
 * @returns {Function}
 */
function triangleGenerator (options) {
    var o = options || {};
    return function (i) {
        return {
            i      : i,
            x      : i / o.fps,
            y      : 1 - Math.abs((2 * (i / o.waveLength % o.fps) / o.fps) - 1),
            length : o.length
        }
    }
}

/**
 * generates a block wave with a specific length
 *
 * the output values are normalized [0-1]
 *
 * @param waveLength
 * @param fps
 * @param
 * @returns {Function}
 */
function blockGenerator (options) {
    var o = options || {};
    return function (i) {
        return {
            i      : i,
            x      : i / o.fps,
            y      : (i / o.waveLength % o.fps) / o.fps > o.ratio ? 0 : 1,
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

/**
 * utility function for visualising the value on the command line
 * @param i
 * @returns {string}
 */
function toHashes (i, maxHashes, char) {
    return (new Array(Math.floor(i * (maxHashes || 40)))).join(char || '#');
}