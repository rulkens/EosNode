/**
 * Create A fire observable with a set of options
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

module.exports = fireObservable;


fireObservable.defaults = {
    fps        : 60.0,
    length     : .5,
    waveLength : .5,
    palette : gradients.blackBody, // a palette to use instead of just a color
    light      : {
        size  : 4
    },
    position   : .5,
    //width      : .4
};

function fireObservable (options) {
    var o = _.merge({}, fireObservable.defaults, options);

    var wave = rxUtil.wave.sawtooth(o);
    return wave;
}