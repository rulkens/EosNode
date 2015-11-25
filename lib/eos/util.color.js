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
    intToHex       : intToHex
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

function hsvToInt(hsv){
    return colorToInt(Color(hsv));
}

/**
 * TODO: make this work properly
 *
 * @param colorsArrays
 */
function sumColorArrays (colorsArrays) {
    if (!colorsArrays || colorsArrays.length == 0) return;

    // group the items together
    var colors = _.zip.apply(undefined, colorsArrays)
        .map(colors => sumColors(colors));

    //console.log('colors', colors);
    return colors;
}

/**
 * takes an array of colors and return one color
 * @param colors
 */
function sumColors (colors) {
    var ret = colors.reduce((memo, color) => {
        var c = intToRgb(color);
        // convert to color
        return blendModes.add(memo, c);
    }, [0, 0, 0]);

    //console.log('ret', ret);

    return rgbToInt(ret);
}

function intToHex (i) {
    return i.toString(16);
}