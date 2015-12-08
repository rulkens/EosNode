/**
 * Experimenting a bit with converting leap motion to observable data
 */
var _                  = require('lodash'),
    Rx                 = require('rx'),
    Color              = require('color'),
    leapjs             = require('leapjs'),
    util               = require('../lib/eos/util'),
    colorUtil          = require('../lib/eos/util.color'),
    rxUtil             = require('../lib/eos/util.rx'),

    Api                = require('../lib/eos/api'),
    settings           = require('../settings'),
    ColorLight         = require('../lib/eos/light.color'),
    lightObservable    = require('../lib/eos/actions.rx/light.color.observable'),
    sparklesObservable = require('../lib/eos/actions.rx/sparkles.color.observable');

//var oLeap = require('../lib/eos/util.leap.rx');
var api = new Api(settings).connect();

// custom light settings
var lightSettings = [
    {
        length     : 200,
        waveLength : 3.0,
        transform  : {
            scale  : 0.5,
            offset : 0.5
        }
    },
    {
        length     : 200,
        waveLength : 3.1,
        transform  : {
            scale  : 0.5,
            offset : 0.5
        }
    }
];

var controller = new leapjs.Controller();
var connected = Rx.Observable.fromEvent(controller, 'connect');
var streamingStarted = Rx.Observable.fromEvent(controller, 'streamingStarted');
var streamingStopped = Rx.Observable.fromEvent(controller, 'streamingStopped');
var frame = Rx.Observable.fromEvent(controller, 'frame');

// hands
var hand = frame
    .filter((frame) => frame.hands.length > 0)
    .map((frame) => frame.hands[0]);

var hands = frame
    .filter((frame) => frame.hands.length > 0)
    .map((frame) => frame.hands);

var leftHand = hands
    .filter(handType('left'))
    .map(getLeftHand);

var rightHand = hands
    .filter(handType('right'))
    .map(getRightHand);

var leftHandToLight = leftHand
    .filter(filterConfidence)
    .map(mapOneHand);
var rightHandToLight = rightHand
    .filter(filterConfidence)
    .map(mapOneHand);

var leftLight = lightObservable(lightSettings[0])
    .combineLatest(leftHandToLight, mergeLightSettings)
    .map(toResult);

var rightLight = lightObservable(lightSettings[1])
    .combineLatest(rightHandToLight, mergeLightSettings)
    .map(toResult);

var sparkles = sparklesObservable();

var colorsCombined = rxUtil
    .combineColors([leftLight, rightLight, sparkles])
    .throttle(16)
    .scan(colorUtil.fadeColors, ColorLight.defaults.numLights);

connected.subscribe(() => console.log('connected'));
streamingStarted.subscribe(() => console.log('streamingStarted'));
streamingStopped.subscribe(() => console.log('streamingStopped'));

// send to the api
colorsCombined.subscribe(toApi);

// start it off (
// TODO: we should do this automatically in the observables
controller.connect();

// UTILITY FUNCTIONS
function mapOneHand (hand) {

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
        color    = Color({hue : hue, saturation : 100 * zPos, value : 100}),
        ret      = {position : yPos, color : colorUtil.colorToInt(color)};

    return ret;
}

function mergeLightSettings (light, settings) {
    // aiai
    var lightCopy = light.clone();
    _.extend(lightCopy, settings);
    return lightCopy;
}

function filterConfidence (hand) {
    return hand.confidence > .3;
}

/**
 * check if a certain type of hand is available in the hand array
 * @param type
 * @returns {Function}
 */
function handType (type) {
    return function (hands) {
        return hands.filter(function (hand) {
                return hand.type === type
            }).length > 0;
    }
}

function getLeftHand (hands) {
    for (i in hands) {
        if (hands[i].type === 'left') return hands[i]
    }
}

function getRightHand (hands) {
    for (i in hands) {
        if (hands[i].type === 'right') return hands[i]
    }
}

function toResult (light) {
    return light.result();
}



function toApi (light) {
    api.colors.set(light);
}