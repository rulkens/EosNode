/**
 * EOS utility class
 *
 * TODO: if this gets bigger, split it up in different files
 */

module.exports = {
    sumIlluminances : sumIlluminances,
    emptyArray      : emptyArray,
    sumArrays       : sumArrays,
    range           : range,
    clip            : clip,
    clamp           : clamp,
    normalize       : normalize
};

/**
 * returns an empty array of <size> elements, otherwise return an array filled with <value>
 * @param size
 * @param value
 * @returns {Array|*}
 */
function emptyArray (size, value) {
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
    //console.log('illuminanceArrays', illuminanceArrays);
    return sumArrayOfArrays(illuminanceArrays);
}

// probably find a faster algorithm for this
function range (i) {
    return i ? range(i - 1).concat(i - 1) : []
}

/**
 * clips a number between 0-1
 * @example clip(.4) == .4, clip(-1.3) == 0, clip(1.6) == 1
 * @param i
 * @returns {number}
 */
function clip (i) {
    return Math.min(1, Math.max(0, i));
}

/**
 * like clip, but with a customizable minimum and maximum
 * @param num
 * @param min
 * @param max
 * @returns {number}
 */
function clamp (num, min, max) {
    return Math.max(min, Math.min(num, max));
}

/**
 * use in an class with a this parameter
 * assumes the object has a numLights property
 * @param i
 * @returns {number}
 */
function normalize (i) {
    return i / (this.numLights - 1);
}
