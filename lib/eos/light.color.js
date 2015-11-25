/**
 * Color light
 */
'use strict';

var _         = require('lodash'),
    util      = require('./util'),
    colorUtil = require('./util.color');

var defaults      = {
        position     : 0.5,
        size     : 20.0,
        color    : 0xFF00,
        numLights : 120,
        intensity : 1.0,
        falloffCurve : 'cube'
    },
    falloffCurves = {
        'linear' : function (dist, size) {
            return 1 - Math.abs(dist / size);
        },
        'quad'   : function (dist, size) {
            return 1 - Math.pow(Math.abs(dist / size), 2);
        },
        'cube'   : function (dist, size) {
            return 1 - Math.pow(Math.abs(dist / size), 3);
        }
    };

module.exports = Light;

function Light (options) {
    _.defaults(this, defaults);
    _.extend(this, options);
}

Light.prototype.result = result;
Light.prototype.colorAt = colorAt;

function result () {
    var values = util.range(this.numLights);

    // normalize range
    values = values.map(util.normalize, this);
    // get intensities
    values = values.map(this.colorAt, this);

    return values;
}

function colorAt (pos) {
    var distance  = Math.abs(pos - this.position),
        intensity = falloffCurves[this.falloffCurve](distance, .5 * this.size / this.numLights),
        color     = colorUtil.intToColor(this.color);

    intensity = util.clip(intensity * this.intensity);
    // set the intensity

    color = color.lightness(intensity * 50);

    color = colorUtil.colorToInt(color);

    return color;
}