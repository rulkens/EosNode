var expect    = require("chai").expect,
    util = require('../util');

describe('util', function () {
    describe('util.sumIlluminances', function () {
        it('should sum a list of illuminances from [0-1]', function () {
            var illuminances = [.1,.1,.1,.1,.1];
            var result = util.sumIlluminances(illuminances);
            expect(result).to.equal([.1,.1,.1,.1,.1]);
        });
    });
    
    describe('util.sumColors', function () {
        it('should sum a list of int colors', () => {
            var colors = [0xFF, 0xFF00, 0xFF0000];
        
        })
    });
});