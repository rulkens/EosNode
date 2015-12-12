/**
 * Experimenting a bit with converting leap motion to observable data
 */
var _          = require('lodash'),
    Rx         = require('Rx'),
    Color      = require('color'),
    settings   = require('../settings'),
    util       = require('../lib/eos/util'),
    colorUtil  = require('../lib/eos/util.color'),
    rxUtil     = require('../lib/eos/util.rx'),
    Api        = require('../lib/eos/api'),
    ColorLight = require('../lib/eos/light.color'),
    leap       = require('../lib/eos/actions.rx/leap-motion.observable'),
    Light      = require('../lib/eos/actions.rx/light.color.observable'),
    Sparkles   = require('../lib/eos/actions.rx/sparkles.color.observable');

//var oLeap = require('../lib/eos/util.leap.rx');
var api = new Api(settings).connect();

// custom light settings
var lightSettings = {
    left  : {
        length     : 200,
        waveLength : 3.0,
        wave       : {
            scale  : 0.5,
            offset : 0.5
        }
    },
    right : {
        length     : 200,
        waveLength : 3.1,
        wave       : {
            scale  : 0.5,
            offset : 0.5
        }
    }
};

var sparklesSettings = {
    chance: .1,
    color: 0xFF0000
};

var colorsCombined = rxUtil
    .combineColors([sparklesAppear(sparklesSettings), leftAppear(), rightAppear()])
    .throttle(16)
    // fade stuff
    .scan(colorUtil.fadeColors, Light.defaults.numLights)
// start empty
//.startWith(Light.allLightsOff);

// DEBUG INFO
leap.connected().subscribe(() => console.log('connected'));
leap.streamingStarted().subscribe(() => console.log('streamingStarted'));
leap.streamingStopped().subscribe(() => console.log('streamingStopped'));

//leftAppear.subscribe(toApi);
leap.handOn('left').subscribe(() => console.log('left hand animation'));
leap.handOn('right').subscribe(() => console.log('right hand animation'));

// send to the api
colorsCombined.subscribe(toApi);


var off = Light.off().map(toLightResult);
off.subscribe(toApi);


// UTILITY FUNCTIONS

function leftAppear () {
    return leap.handState('left')
        //.do(() => console.log('left hand state changed'))
        .flatMapLatest(stateToLight$('left', lightSettings.left))
        .map(toLightResult);
}

function rightAppear () {
    return leap.handState('right')
        .flatMapLatest(stateToLight$('right', lightSettings.right))
        .map(toLightResult);
}

function sparklesAppear () {
    return leap.handsState()
        .map(state => !state) // inverse state
        .flatMapLatest(stateToSparkles$())
}

leap.handsState().map(state => !state).subscribe(function (state) {
    if (state) {
        console.log('one or more hands on');
    } else {
        console.log('one or more hands off');
    }
});

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
        yPos     = (hand.palmPosition[1] - 100) / 350,
        zPos     = util.clip(1 - ((hand.palmPosition[2]) / 200)),
        yaw      = hand.yaw(),
        roll     = (hand.roll() / (Math.PI * 2)) + .5,
        rollNorm = (roll - .3) * 1.3,
        hue      = (roll * 360) % 360,
        //rotationAngle = hand.rotationAngle(),
        // hand grabstrength = intensity (more grabbing is less intensity)
        size     = (1 - hand.grabStrength),
        color    = Color({hue : hue, saturation : 100 * zPos, value : 100});

    //console.log('zPos', zPos);
    return {position : yPos, intensity : zPos, color : colorUtil.colorToInt(color)};
}

function handToLight$ (type) {
    return leap.hand(type)
        .filter(filterConfidence)
        .map(mapHandToLight);
}

/**
 * copy properties from the settings object into a new light object and return it
 * @param light
 * @param settings
 * @returns {ColorLight}
 */
function overrideLightSettings (light, settings) {
    // aiai
    var lightCopy = light.clone();
    _.extend(lightCopy, settings);
    return lightCopy;
}

/**
 *
 * @param state
 * @returns {Light$}
 */
function stateToLight$ (handType, lightSettings) {
    var lightOn = Light(lightSettings)
        .combineLatest(handToLight$(handType), overrideLightSettings)
        .concat(Light.off());

    return stateToObservable(lightOn, Light.off());
}

function stateToSparkles$ (settings) {
    return stateToObservable(Sparkles({ chance: .01}).concat(Light.off()), Light.off());
}

function stateToObservable (observableOn, observableOff) {
    return function (state) {
        return state ? observableOn : observableOff
    }
}

function filterConfidence (hand) {
    return hand.confidence > .3;
}

function toLightResult (light) {
    //console.log('light', light);
    return light.result();
}

function toApi (light) {
    //console.log('light', light);
    api.colors.set(light);
}