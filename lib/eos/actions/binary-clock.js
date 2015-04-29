/**
 * Created by rulkens on 29/04/15.
 */
var inherits = require('inherits'),
    _ = require('lodash'),
    Action = require('../action');

/**
 * returns a list of values for the current time
 * @returns {*|Array}
 */
function valsInTime(){
    var seconds = clock.secSinceMidnight();
    //convert the number to binary, pad it and reverse it
    var secondsBin = dec2Bin(seconds);
    var vals = secondsBin
        .split("")
        .map(function(val){
            return val === "1" ? 1 : 0;
        })
        .reverse();
    console.log(vals);
    return vals;
}

function dec2Bin(dec){
    return (dec >>> 0).toString(2);
}

var BinaryClock = function () {
    Action.prototype.constructor.apply(this, arguments);
};

inherits(BinaryClock, Action);

BinaryClock.prototype.step = function () {
    return valsInTime();
};

module.exports = BinaryClock;