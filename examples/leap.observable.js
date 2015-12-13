/**
 * Experimenting a bit with converting leap motion to observable data
 */
var _          = require('lodash'),
    Rx = require('Rx'),
    Color      = require('color'),
    settings   = require('../settings'),
    util       = require('../lib/eos/util/util'),
    colorUtil  = require('../lib/eos/util/util.color.js'),
    rxUtil     = require('../lib/eos/util/util.rx.js'),
    Api        = require('../lib/eos/api'),
    ColorLight = require('../lib/eos/light.color'),
    leap       = require('../lib/eos/actions.rx/leap-motion.observable'),
    Light      = require('../lib/eos/actions.rx/light.color.observable'),
    Sparkles   = require('../lib/eos/actions.rx/sparkles.color.observable');

//var oLeap = require('../lib/eos/util.leap.rx');
var api = new Api(settings).connect();

// custom light settings
var lightSettings = [
    {
        length     : 200,
        waveLength : 3.0,
        wave  : {
            scale  : 0.5,
            offset : 0.5
        }
    },
    {
        length     : 200,
        waveLength : 3.1,
        wave  : {
            scale  : 0.5,
            offset : 0.5
        }
    }
];

var leftHandToLight = leap.hand('left')
    .filter(filterConfidence)
    .map(mapHandToLight);

var rightHandToLight = leap.hand('right')
    .filter(filterConfidence)
    .map(mapHandToLight);

var leftLight = Light(lightSettings[0])
    .combineLatest(leftHandToLight, mergeLightSettings)
    .map(toResult);

var rightLight = Light(lightSettings[1])
    .combineLatest(rightHandToLight, mergeLightSettings)
    .map(toResult)
    .startWith(Light.allLightsOff);

//setInterval(function () {
//    console.log('x');
//}, 60);

var colorsCombined = rxUtil
    .combineColors([leftLight, rightLight])
    .throttle(16)
    // fade stuff
    .scan(colorUtil.fadeColors({ fastOn : true }), Light.defaults.numLights)
    // start empty
    .startWith(Light.allLightsOff);

// DEBUG INFO
leap.connected().subscribe(() => console.log('connected'));
leap.streamingStarted().subscribe(() => console.log('streamingStarted'));
leap.streamingStopped().subscribe(() => console.log('streamingStopped'));

//leftAppear.subscribe(toApi);
leap.handOn('left').subscribe(() => console.log('left hand animation'));
leap.handOn('right').subscribe(() => console.log('right hand animation'));

// send to the api
colorsCombined.subscribe(toApi);

// UTILITY FUNCTIONS

/**
 * map a hand to light settings
 * @param hand
 * @returns {LightSettings}
 * @todo make this configurable
 */
function mapHandToLight (hand) {

    if (!hand) return {intensity : 0}; // return a light that is off

    // map Y to light Position
    var xPos     = hand.palmPosition[0],
        yPos     = (hand.palmPosition[1] - 100) / 400,
        zPos     = util.clip((hand.palmPosition[2] + 100) / 500),
        yaw      = hand.yaw(),
        roll     = (hand.roll() / (Math.PI * 2)) + .5,
        rollNorm = (roll - .3) * 1.3,
        hue      = (roll * 360) % 360,
        //rotationAngle = hand.rotationAngle(),
        // hand grabstrength = intensity (more grabbing is less intensity)
        size     = (1 - hand.grabStrength),
        color    = Color({hue : hue, saturation : 100 * zPos, value : 100});

    return {position : yPos, color : colorUtil.colorToInt(color)};
}

/**
 * copy properties from the settings object into a new light object and return it
 * @param light
 * @param settings
 * @returns {Light$}
 */
function mergeLightSettings (light, settings) {
    // aiai
    var lightCopy = light.clone();
    _.extend(lightCopy, settings);
    return lightCopy;
}

function filterConfidence (hand) {
    return hand.confidence > .3;
}

function toResult (light) {
    //console.log('light', light);
    return light.result();
}

function toApi (light) {
    //console.log('light', light);
    api.colors.set(light);
}