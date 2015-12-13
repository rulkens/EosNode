'use strict';

var expect    = require("chai").expect,
    colorUtil = require('../util/util.color.js'),
    Color = require('color');

describe('util.color', () => {
    let c = Color(255,255,255);

    describe('util.color.sumColorArrays', function () {
        it('should sum a list of int colors', () => {
            let colors = [
                [0xFF, 0xFF00, 0xFF0000],
                [0xFF, 0xFF00, 0xFF0000]
                ];
            //let result = colorUtil.sumColorArrays(colors);
        });
    });

    describe('util.color.sumColors', function () {
        it('should sum a list of int colors', () => {
            let colors = [0xFF, 0xFF];

            let result = colorUtil.sumColors(colors);
            console.log('result', colorUtil.intToHex(result));
        });
    });
});
