/**
 * Created by rulkens on 29/04/15.
 */
'use strict';

var _ = require('lodash'),
    util = require('./util');

var defaults = {
        position: 0,
        size: 3.0,
        intensity: 1.0,
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
    result: function () {
        // from http://stackoverflow.com/questions/6299500/tersest-way-to-create-an-array-of-integers-from-1-20-in-javascript
        var values = util.range(this.numLights);

        // normalize range
        values = values.map(util.normalize, this);
        // get intensities
        values = values.map(this.intensityAt, this);
        // clip
        values = values.map(util.clip);
        //
        //var totalIntensity = values.reduce(function (memo, i) {
        //    return memo + i;
        //}, 0);

        // to do anti-aliasing, normalize the values towards the intensity
        // i.e. the total surface area under the curve is equal to the intensity
        //values = values.map(function (i) {
        //    return this.intensity * i / totalIntensity;
        //}, this);
        return values;
    },

    intensityAt: function (pos) {
        var distance = Math.abs(pos - this.position);
        var intensity = falloffCurves[this.falloffCurve](distance, .5 * this.size / this.numLights);
        return intensity * this.intensity;
    }
};

module.exports = Light;