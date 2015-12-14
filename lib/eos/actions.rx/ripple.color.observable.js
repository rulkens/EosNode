/**
 * Create A ripples observable with a set of options
 */
'use strict';

var _          = require('lodash'),
    util       = require('../util/util'),
    colorUtil  = require('../util/util.color.js'),
    rxUtil     = require('../util/util.rx.js'),
    noise      = require('../util/util.noise.js'),
    Gradient   = require('../util/util.color').Gradient,
    Light      = require('./light.color.observable'),
    ColorLight = require('../light.color'),
    numLights  = require('../light.color').defaults.numLights;

module.exports = rippleObservable;


rippleObservable.defaults = {
    fps        : 60.0,
    length     : .5,
    waveLength : .5,
    color      : 0x77FFFF, // color of the ripple
    // palette : [0x0, 0xFFFFFF] // a palette to use instead of just a color
    light      : {
        wave  : {
            scale  : .5,
            offset : .5
        },
        light : {
            color : 0xFF,
            size: 4
        }
    },
    position   : .5,
    width      : .4
};

function rippleObservable (options) {
    var o = _.merge({}, rippleObservable.defaults, options);

    var wave = rxUtil.wave.sawtooth(o)
        .map(function (wave) {
            var l1 = new ColorLight(o.light.light),
                l2 = new ColorLight(o.light.light);

            l1.position = o.position + Math.sqrt(wave.y) * o.width;
            l1.intensity = 1 - Math.sqrt(wave.y);

            l2.position = o.position - Math.sqrt(wave.y) * o.width;
            l2.intensity = 1 - Math.sqrt(wave.y);
            return [l1, l2];
        })
        .map(lights => lights.map(light => light.result()))
        .map(lights => colorUtil.sumColorArrays(lights))
        .concat(Light.off().map(light => light.result()));

    return wave;
    //var l1$ = Light(o.light);
    //var l2$ = Light(o.light);
    //
    //return l1$.map(light => light.result());
}