'use strict';

/**
 testing Rx's observable

 FRP FTW!!

 my first foray into RxJS, and I like it!
 **/

var Rx       = require('rx'),
    noise    = require('../lib/eos/util.noise'),
    Light    = require('../lib/eos/light'),
    Api      = require('../lib/eos/api'),
    settings = require('../settings'),
    util     = require('../lib/eos/util');

var fps           = 60.0,
    waveLength    = 3.0, // in seconds
    totalLength   = 20.0, // in seconds
    attackLength  = 2.0,
    releaseLength = 4.0;

let attack = fps * attackLength;    // in frames
let release = fps * releaseLength;
let total = fps * totalLength;

var api = new Api(settings).connect();

var loop = Rx.Observable.interval(1000 / fps); // a forever running loop
var animation = loop.take(totalLength * fps); // a fixed length animation

/*   #   #
    ##  ##
   ### ###
 */
var sawtoothWave = loop
    .take(totalLength * fps)
    .map(squareWaveGenerator(waveLength, fps));

/*   #    ##
    ##   ###
   #### #####
 */
var sineWave = loop
    .take(totalLength * fps)
    .map(sineWaveGenerator(waveLength, fps))
    .map(transformWave({scale : 0.3, offset : 0.5}));

var envelopedWave = sineWave
    .map(envelopeGenerator(attack, release, total));

var light1 = animation
    .delay(6000)
    .startWith(0)
    .map(sineWaveGenerator(waveLength * 1.5, fps))  // breathing simulation
    .map(transformWave({scale : 0.3, offset : 0.5}))
    .map(envelopeGenerator(attack * 2, release, total))
    .map(waveToLight({ position : 0.2 }))
    .map(light => light.result());

var light2 = envelopedWave
    .map(waveToLight({ position: 0.8 }))
    .map(light => light.result());

//var lightsCombined = Rx.Observable
//    .merge(light1, light2)
//    .map(util.sumIlluminances);

var lightsCombined = light1
    .combineLatest(light2, (light1, light2) => [light1, light2])
    .map(util.sumIlluminances);

var lightsSequence = light1.concat(light2);
    //.map(util.sumIlluminances);


var hashes = envelopedWave.map(toHashes);
hashes.subscribe(console.log);

lightsCombined.subscribe(nextLight, errorLight, completedLight);
// EXPERIMENTAL SERVER talk

function nextHashes (value) {
    //console.log('value', value);
    // talk to the server?
}

function nextLight (values) {
    //console.log('values', values);
    api.lights.set(values);
}

function errorLight (error) {
    console.error('ouch!');
}

function completedLight (completed) {
    console.log('light sequence completed!');
    api.disconnect();
}

/**
 * generates a square wave with a specific length
 * @param waveLength
 * @param fps
 * @returns {Function}
 */
function squareWaveGenerator (waveLength, fps) {
    return function (i) {
        return {
            x : i,
            y : (i / waveLength % fps) / fps
        }
    }
}

function sineWaveGenerator (waveLength, fps) {
    return function (i) {
        return {
            x : i,
            y : .5 - .5 * Math.cos((i / waveLength % fps) / fps * Math.PI * 2)
        }
    }
}

/**
 * can transform with options { scale = 1, offset = 0 }
 * @param options
 * @returns {transform}
 */
function transformWave (options) {
    let o = options || {};
    return function (wave) {
        return {
            x : wave.x,
            y : (wave.y * (o.scale || 1)) + (o.offset || 0)
        }
    }
}

function envelopeGenerator (attack, release, total) {
    return function (wave) {
        let y = (wave.x < attack) // attack
            ? wave.y * (wave.x / attack)
            : (wave.x > total - release)  // release
            ? wave.y * ((total - wave.x) / release)
            : wave.y;
        return {
            x : wave.x,
            y : y
        }
    }
}

/**
 * utility function for visualising the value on the command line
 * @param i
 * @returns {string}
 */
function toHashes (i) {
    return (new Array(Math.floor(i.y * 40))).join('#');
}

noise.seed(Math.random());
var noiseval = noise.perlin2(0, .3 * .001)[0];
console.log('noiseval', noiseval);

/**
 * convert a wave object { i, y } to a Light object
 */
function waveToLight (options) {
    var o = options || {};
    return function (wave) {
        var noiseval = noise.perlin2(0, wave.x * .002) * .2;
        //var noiseval = noise.perlin2(0, i * .001)[0];
        console.log('noiseval', noiseval);
        return new Light({intensity : wave.y, position : o.position + noiseval || 0.5});
    }

}