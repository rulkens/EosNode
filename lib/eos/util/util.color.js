var _     = require('lodash'),
    Color = require('color'),
    util  = require('./util');

module.exports = {
    intToColor     : intToColor,
    colorToInt     : colorToInt,
    hsvToInt       : hsvToInt,
    intToRgb       : intToRgb,
    rgbToInt       : rgbToInt,
    sumColors      : sumColors,
    sumColorArrays : sumColorArrays,
    intToHex       : intToHex,
    fadeColors     : fadeColors,
    gamma          : gamma,
    correct        : correct,
    correctColors: correctColors,

    Color    : Color,
    Gradient : Gradient
};

/**
 * linear correction for the lights
 * @type {{r: number, g: number, b: number}}
 */
var defaultGamma = 2.7;
var colorCorrect = {
    r : .82,
    g : 1.2,
    b : .91
};

var blendModes = {
    normal    : function (rgb1, rgb2) {
        return rgb2
    },
    add       : function (rgb1, rgb2) {
        return [Math.min(rgb1[0] + rgb2[0], 255), Math.min(rgb1[1] + rgb2[1], 255), Math.min(rgb1[2] + rgb2[2], 255)]
    },
    subtract  : function (rgb1, rgb2) {
        return [Math.max(rgb1[0] - rgb2[0], 0), Math.max(rgb1[1] - rgb2[1], 0), Math.max(rgb1[2] - rgb2[2], 0)]
    },
    multiply  : function (rgb1, rgb2) {
        return [rgb1[0] * rgb2[0] / 255, rgb1[1] * rgb2[1] / 255, rgb1[2] * rgb2[2] / 255]
    },
    screen    : function (rgb1, rgb2) {

    },
    overlay   : function (rgb1, rgb2) {

    },
    hardLight : function () {

    },

    softLight : function () {

    }
};

/**
 * converts a color object to an integer
 * @param color
 * @returns {*}
 */
function colorToInt (color) {
    return rgbToInt(color.rgbArray());
}

/**
 * converts an integer to a Color object
 * @param i
 * @returns {Color}
 */
function intToColor (i) {
    return Color().rgb(intToRgb(i));
}

/**
 * converts an array of three values [r, g, b] into an integer
 * @param rgb
 * @returns {*}
 */
function rgbToInt (rgb) {
    return (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
}

/**
 * returns an array of 3 values, [r, g, b]
 * @param i
 * @returns {*[]}
 */
function intToRgb (i) {
    return [(i >> 16) & 0xFF, (i >> 8) & 0xFF, i & 0xFF];
}

function hsvToInt (hsv) {
    return colorToInt(Color(hsv));
}

/**
 * TODO: make this work properly
 *
 * @param colorsArrays
 */
function sumColorArrays (blendMode) {

    return function(colorsArrays){
        if (!colorsArrays || colorsArrays.length == 0) return;

        // group the items together
        var colors = _.zip.apply(undefined, colorsArrays)
            .map(colors => sumColors(colors, blendMode));

        return colors;
    }
}

/**
 * takes an array of colors and return one color
 * @param colors
 */
function sumColors (colors, blendMode) {
    var ret = colors.reduce((memo, color) => {
        var c = intToRgb(color);
        // convert to color
        return blendModes[blendMode || 'add'](memo, c);
    }, [0, 0, 0]);

    //console.log('ret', ret);

    return rgbToInt(ret);
}

function intToHex (i) {
    return i.toString(16);
}

function fadeColors (options) {
    var o = options || {};
    var FADE_DEFAULT_RATIO = .96;

    return function fade(prevColors, colors){
        return _.zipWith(prevColors, colors, function (prevColor, color) {
            // perhaps optimize this :)
            var p = intToColor(rgbToInt(intToRgb(prevColor).map(val => Math.max(0, val - 1))));
            var c = intToColor(color);
            var n; // new color

            if (o.fastOn && c.luminosity() > p.luminosity()) {
                // only do this when we want to turn on the light very fast
                return color;
            } else {
                n = p.mix(c, o.ratio || FADE_DEFAULT_RATIO); //.darken(.9);
                // blend and darken
                return colorToInt(n);
            }
        });
    }


}

// GAMMA AND COLOR CORRECTION

function gamma (color, gamma) {
    var rgb = color.rgb();
    return Color({
        r : util.clamp(255 * Math.pow(rgb.r / 255, gamma), 0, 255),
        g : util.clamp(255 * Math.pow(rgb.g / 255, gamma), 0, 255),
        b : util.clamp(255 * Math.pow(rgb.b / 255, gamma), 0, 255)
    });
}

function correct (color) {
    var rgb;
    if(!color.rgb){
        // we assume it's an integer?
        rgb = intToColor(color).rgb();
    } else {
        rgb = color.rgb();
    }

    return Color({
        r : util.clamp(colorCorrect.r * rgb.r, 0, 255),
        g : util.clamp(colorCorrect.g * rgb.g, 0, 255),
        b : util.clamp(colorCorrect.b * rgb.b, 0, 255)
    });
}

function correctColors(colors){
    return colors.map(function(color){
        return colorToInt(gamma(correct(intToColor(color)), defaultGamma));
    })
}
// GRADIENT
function Gradient (values) {
    this.values = values || [];
}

/**
 * pos goes from 0 - 1
 *
 * @todo: make it also accept color objects
 */
Gradient.getVal = getVal;

function getVal (values, pos) {
    // divide in multiple gradients
    if (values.length > 2) {
        // figure out which two we should take
        var index  = Math.floor(pos * (values.length - 1)),
            relPos = (pos * (values.length - 1)) % 1;

        return getVal([values[index], values[index + 1]], relPos);
    } else {
        var c1 = intToColor(values[0]);
        var c2 = intToColor(values[1]);

        // blend colors
        return c2.mix(c1, pos);
    }
}