var Color     = require('color'),
    colorUtil = require('./lib/eos/util.color');

//var red = colorUtil.intToColor(0xFF0000),
//    green = colorUtil.intToColor(0xFF00),
//    blue = colorUtil.intToColor(0xFF);

/*var red = colorUtil.intToRgb(0xFF0000),
 green = colorUtil.intToRgb(0xFF00),
 blue = colorUtil.intToRgb(0xFF);*/

var red   = colorUtil.rgbToInt([0xFF, 0, 0]),
    green = colorUtil.rgbToInt([0, 0xFF, 0]),
    blue  = colorUtil.rgbToInt([0, 0, 0xFF]);

console.log('red, green, blue', red, green, blue);