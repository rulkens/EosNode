/**
 * EOS utility class
 *
 * TODO: if this gets bigger, split it up in different files
 */

module.exports = {
    sumIlluminances  : sumIlluminances,
    sumColors        : sumColors,

    emptyArray       : emptyArray,
    sumArrays        : sumArrays,
    sumArrayOfArrays : sumArrayOfArrays,

    range            : range,
    clip             : clip,
    normalize        : normalize
};

/**
 * returns an empty array of <size> elements, otherwise return an array filled with <value>
 * @param size
 * @param value
 * @returns {Array|*}
 */
function emptyArray(size, value) {
    return Array.apply(null, new Array(size)).map(Number.prototype.valueOf, value || 0);
}

/**
 * sums two arrays, returns the sum of each element.
 * NOTE: make sure you supply two arrays of the same length!
 * @param a1
 * @param a2
 * @returns {Array|*}
 */
function sumArrays (a1, a2) {
    return a1.map(function (item, index) {
        return a1[index] + a2[index];
    });
}

function sumArrayOfArrays (a) {
    return a.reduce(function (memo, res) {
        return sumArrays(memo, res);
    }, emptyArray(a[0].length))
}

function sumIlluminances (illuminanceArrays) {
    return sumArrayOfArrays(illuminanceArrays);
}

function sumColors (colorsArrays){
    if(!colorsArrays || colorsArrays.length == 0) return;

    console.log('colorsArrays', colorsArrays);
    return sumArrayOfArrays(colorsArrays);
}

function range (i) {
    return i ? range(i - 1).concat(i - 1) : []
}

function clip (i) {
    return Math.min(1, Math.max(0, i));
}

function normalize (i) {
    return i / (this.numLights - 1)
}
