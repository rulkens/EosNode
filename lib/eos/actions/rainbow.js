/**
 * Moves two lights in opposite direction over the lamp
 */
'use strict';

var inherits  = require('inherits'),
    _         = require('lodash'),
    Action    = require('../action'),
    Light     = require('../light'),
    util      = require('../util/util'),
    colorUtil = require('../util/util.color.js'),
    Color     = require('color'),
    colorApi   = require('../api.colors');

var defaults = {
    speed : 5.0 // in lights per second
};

// TODO: move this somewhere else
var FRAMERATE  = 30,
    NUM_LIGHTS = 128,
    LIGHTS_SEC = FRAMERATE * NUM_LIGHTS;

module.exports = Rainbow;

inherits(Rainbow, Action);

Rainbow.prototype.step = step;

function Rainbow (options) {
    Action.prototype.constructor.apply(this, arguments);

    _.defaults(this, defaults);
    _.extend(this, options);

    this.timeStep = 0;
}

function step () {

    var that = this;

    this.timeStep += this.speed / LIGHTS_SEC;

    var result = _.range(0, colorApi.NUM_LIGHTS)
        .map(function normalize (item) {
            return (item / colorApi.NUM_LIGHTS);
        })
        .map(function animate(item) {
            return (item + that.timeStep) % 1;
        })
        //.map(item => item *= that.timeStep)
        .map(util.clip)
        .map(function toColor (item) {
            return Color().hsl({ h : item * 360, s : 100, l: 50});
        })
        .map(colorUtil.colorToInt);

    //console.log('result', result.length);

        //.map(function (item) {
        //    console.log('item', item);
        //    return item;
        //});

    //console.log('result', result);
    return {color : result }; // util.sumIlluminances(result)};
}