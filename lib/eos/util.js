/**
 * EOS utility class
 */

var emptyArray = function (size, value) {
        return Array.apply(null, new Array(size)).map(Number.prototype.valueOf, value || 0);
    },
    sumArrays = function (a1, a2) {
        return a1.map(function (item, index) {
            return a1[index] + a2[index];
        });
    },
    sumArrayOfArrays = function(a){
        return a.reduce(function(memo, res){
            return sumArrays(memo, res);
        }, emptyArray(a[0].length))
    },
    sumIlluminances = function(illuminanceArrays){
        return sumArrayOfArrays(illuminanceArrays);
    },
    range = function range1(i){return i?range1(i-1).concat(i-1):[]},
    clip = function clip(i){ return Math.min( 1, Math.max( 0, i)); },
    normalize = function normalize(i){ return i / (this.numLights - 1)};


module.exports = {
    emptyArray: emptyArray,
    sumArrays: sumArrays,
    sumArrayOfArrays: sumArrayOfArrays,
    sumIlluminances: sumIlluminances,

    range: range,
    clip: clip,
    normalize: normalize,
};