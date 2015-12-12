/**
 * Experimenting a bit with converting leap motion to observable data
 */
var _          = require('lodash'),
    Rx = require('Rx'),
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

var sparkles = Sparkles();

var colorsCombined = rxUtil
    .combineColors([sparkles, leftAppear(), rightAppear()])
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


var off = Light.off().map(toResult);
off.subscribe(toApi);


// UTILITY FUNCTIONS

function leftAppear(){
    return leap.handState('left')
        //.do(() => console.log('left hand state changed'))
        .flatMapLatest(stateToLight$('left'))
        .map(toResult);
}

function rightAppear (){
    return leap.handState('right')
        .flatMapLatest(stateToLight$('right'))
        .map(toResult);
}

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

    console.log('zPos', zPos);
    return {position : yPos, intensity: zPos, color : colorUtil.colorToInt(color)};
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
 * @returns {Light$}
 */
function mergeLightSettings (light, settings) {
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
function stateToLight$(handType) {
    return function (state){
        return state ?
            // if on
            Light({ wave : { offset : .5 } })
                .combineLatest(handToLight$(handType), mergeLightSettings)
                // TODO: make sure the light goes off as the last action
                .concat(Light.off())
                .finally(() => console.log('light on finished!'))
            // if off
            : Light.off()
            .catch((e) => console.log('light off err', e))
            .finally(() => console.log('light off finished!'));
    }
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