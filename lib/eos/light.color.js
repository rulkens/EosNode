/**
 * Color light
 */
'use strict';

var _ = require('lodash'),
    util = require('./util'),
    Color = require('color');

var defaults = {
        position: 0,
        size: 3.0,
        color: 0x00000F,
        numLights: 120,
        falloffCurve: 'cube'
    },
    falloffCurves = {
        'linear': function (dist, size) {
            return 1 - Math.abs(dist / size);
        },
        'quad': function (dist, size) {
            return 1 - Math.pow( Math.abs(dist / size), 2);
        },
        'cube': function (dist, size) {
            return 1 - Math.pow( Math.abs(dist / size), 3);
        }
    };

var Light = function(options){
    _.defaults(this, defaults);
    _.extend(this, options);
};

Light.prototype = {
    result: function result() {
        var values = util.range(this.numLights);

        // normalize range
        values = values.map(util.normalize, this);

        console.log('values', values.length);
        // get intensities
        values = values.map(this.colorAt, this);

        return values;
    },

    /**
     * @param pos
     * @returns {Color}
     */
    colorAt : function (pos) {
        var distance = Math.abs(pos - this.position);
        var intensity = falloffCurves[this.falloffCurve](distance, .5 * this.size / this.numLights);
        return this.color;
    }
};

module.exports = Light;