'use strict';

/**
 testing Rx's observable

 FRP FTW!!

 my first foray into RxJS, and I like it!
 **/

var Rx                   = require('rx'),

    ColorLight           = require('../lib/eos/light.color'),
    Api                  = require('../lib/eos/api'),
    settings             = require('../settings'),
    util                 = require('../lib/eos/util/util'),
    colorUtil            = require('../lib/eos/util/util.color.js'),
    rxUtil               = require('../lib/eos/util/util.rx.js'),
    lightObservable      = require('../lib/eos/actions.rx/light.observable'),
    colorLightObservable = require('../lib/eos/actions.rx/light.color.observable');

var api = Api(settings);

var lightSettings = [
    {
        length     : 200, // length of 100 sec
        waveLength : 6,
        transform  : {
            scale  : .5,
            offset : .5
        },
        envelope   : {
            length : 100
        },
        light      : {
            position : {
                base : .05
            }
        }
    },
    //{
    //    delay      : 5,
    //    length     : 200,
    //    waveLength : 10,
    //    transform  : {
    //        scale  : .5,
    //        offset : .5
    //    },
    //    light      : {
    //        intensity : 0.5
    //    }
    //},
    {
        waveLength : 5,
        length     : 200,
        transform  : {
            scale  : .5,
            offset : .5
        },
        light      : {
            intensity : .3,
            position  : {
                base      : .9,
                variation : .2
            }
        }
    }
];

var colorSettings = [
    {
        length : 200,
        transform : {
            scale : 0,
            offset : 1
        },
        light: {
            position: {
                variation : .3,
                speed : 1
            },
            hue : {
                base : .1,
                variation : .1
            }
        }
    }
];

var lights = lightSettings.map(settings => lightObservable(settings).map(light => light.result()));
var colors = colorSettings.map(settings => colorLightObservable(settings).map(light => light.result()));

var lightsCombined = rxUtil.combineLights(lights);
var colorsCombined = rxUtil.combineColors(colors);

// SUBSCRIBE FUNCTIONS
// TODO: move to another file
//hashes.subscribe(console.log, e => console.log('error', e), () => console.log('finished!'));

lightsCombined.throttle(25).subscribe(nextLight, errorLight, completedLight);
colorsCombined.throttle(25).subscribe(nextColor, errorColor, completedColor);

// EXPERIMENTAL SERVER talk
function nextLight (values) {
    //console.log('values', values);
    api.lights.set(values);
}

function errorLight (e) {
    console.error('ouch!', e);
}

function completedLight (completed) {
    console.log('light sequence completed!');
    api.disconnect();
}

//colorLight.subscribe(nextColor, errorColor, completedColor);

function nextColor (color) {
    //console.log('color', color);
    api.colors.set(color);
}

function errorColor (e) {
    console.error('ouch! (in color)', e);
}

function completedColor (c) {
    console.log('Color sequence completed!');
}
