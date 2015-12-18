/**
 * Create A wandering light observable with a set of options
 *
 * two lights that move in opposite directions from `position` and fade out
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
    gradients = require('../gradients'),
    numLights  = require('../light.color').defaults.numLights;

module.exports = wanderingLightObservable;


wanderingLightObservable.defaults = {
    fps        : 60.0,
    palette : gradients.blackBody, // a palette to use instead of just a color
    light      : {
        size  : 4
    },

    a: 0, // acceleration preference
    aSpread : 0,
    aChance: 0,

    v : .002,
    vSpread : .005,
    vChance : .005,

    x   : .5,
    xSpread : 0,
    xChance : 0,

    drag : .01
};

function wanderingLightObservable (options) {
    var o = _.merge({}, wanderingLightObservable.defaults, options);

    var a = rxUtil.loop(o.fps)
        .map(() => Math.random() < o.aChance ? Math.random() * o.aSpread - (o.aSpread / 2) : 0)
        .scan((a, da) => a + da, o.a);
    var v = rxUtil.loop(o.fps)
        .map(() => Math.random() < o.vChance ? Math.random() * o.vSpread - (o.vSpread / 2) : 0)
        .withLatestFrom(a, (v, a) => v + a)
        .scan((v, dv) => (1 - o.drag) * v + dv, o.v);
    var x = rxUtil.loop(o.fps)
        .map(() => Math.random() < o.xChance ? Math.random() * o.xSpread - (o.xSpread / 2) : 0)
        .withLatestFrom(v, (x, v) => x + v)
        .scan((x, dx) => x + dx, o.x);

    return x.map(x => ColorLight({ position: x }));
}