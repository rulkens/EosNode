var Color = require('color');

module.exports = {
    intToColor : intToColor,
    colorToInt : colorToInt,
    intToRgb   : intToRgb,
    rgbToInt   : rgbToInt
};

function colorToInt (color) {
    return rgbToInt(color.rgbArray());
}

function intToColor (i) {
    return Color().rgb(intToRgb(i));
}
function rgbToInt (rgb) {
    return (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
}

function intToRgb (i) {
    return [(i >> 16) & 0xFF, (i >> 8) & 0xFF, i & 0xFF];
}