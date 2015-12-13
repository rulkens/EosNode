/**
 * simple example of some gradients
 *
 * here, we apply gamma and color correction specific to the LED strips we use
 *
 */
var _ = require('lodash'),
    settings = require('../settings'),
    Api      = require('../lib/eos/api'),
    util      = require('../lib/eos/util/util'),
    colorUtil  = require('../lib/eos/util/util.color.js'),
    Gradient  = require('../lib/eos/util/util.color').Gradient,
    gradients = require('../lib/eos/gradients'),
    numLights = require('../lib/eos/light.color').defaults.numLights;

var api   = new Api(settings).connect();

var g = gradients.aquaMarine;

var colors = util
    .range(numLights)
    .map(i => i / numLights)
    .map(i => Gradient.getVal(g, i))
    // apply color correction
    .map(c => colorUtil.correct(c))
    // apply gamma correction
    .map(c => colorUtil.gamma(c, 2.7))

// set the gradient
api.colors.set(colors.map(colorUtil.colorToInt));

console.log('colors', colors.map(c => c.hsv()));