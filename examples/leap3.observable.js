/**
 * Experimenting a bit with converting leap motion to observable data
 */
var _         = require('lodash'),
    Rx        = require('Rx'),
    Color     = require('color'),
    settings  = require('../settings'),
    util      = require('../lib/eos/util/util'),
    colorUtil = require('../lib/eos/util/util.color.js'),
    rxUtil    = require('../lib/eos/util/util.rx.js'),
    Api       = require('../lib/eos/api'),
    leap      = require('../lib/eos/actions.rx/leap-motion.observable'),
    Light     = require('../lib/eos/actions.rx/light.color.observable'),
    Sparkles  = require('../lib/eos/actions.rx/sparkles.color.observable'),
    Ripple    = require('../lib/eos/actions.rx/ripple.color.observable'),
    numLights = require('../lib/eos/light.color').defaults.numLights;

var api = Api(settings);

var settings = {
    confidence : .3,

    sparkles : {
        chance : .01,
        color  : 0xFFFFFF
    },

    ripple : {
        length     : .7,
        waveLength : .7,
        light      : {
            intensity : .1,
            color     : 0x110000
        }
    },

    lights : {
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
    }
};

var colorsCombined = rxUtil
    .combineColors([
        sparklesWhenNoHands$(settings.sparkles),
        rippleOnHandOn$('left', settings.ripple),
        rippleOnHandOn$('right', settings.ripple),
        handLight$('left', settings.lights.left),
        handLight$('right', settings.lights.right)])
    .throttle(16)
    // fade stuff
    .scan(colorUtil.fadeColors({fastOn : true}), numLights)
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

/*
 these functions all return an {Observable<LightResult>}
 */
function handLight$ (handType, options) {
    return leap.handState(handType)
        //.do(() => console.log('left hand state changed'))
        // TODO: remove depencency on settings from global scope
        .flatMapLatest(stateToLight$(handType, options))
        .map(toLightResult);

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

        function handToLight$ (type) {
            return leap.hand(type)
                .filter(filterConfidence(settings.confidence))
                .map(mapHandToLight());

            /**
             * map a hand to light settings
             * @param hand
             * @returns {Function<LightSettings>}
             * @todo make this configurable
             */
            function mapHandToLight (options) {
                return function (hand) {
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
            }

            function filterConfidence (confidence) {
                return function (hand) {
                    return hand.confidence > confidence;
                }
            }
        }
    }
}

function sparklesWhenNoHands$ (options) {
    return leap.handsState()
        .map(state => !state) // inverse state
        .flatMapLatest(stateToSparkles$(options));

    function stateToSparkles$ (options) {
        return stateToObservable(Sparkles(options).concat(Light.off()), Light.off());
    }
}

function rippleOnHandOn$ (handType, rippleOptions) {
    return leap.handOn(handType)
        .flatMapLatest(handOnToRipple$(rippleOptions));

    function handOnToRipple$ (options) {
        return function () {
            return Ripple(options);
        }
    }
}

/**
 * utility function
 *
 * @todo move to separate file
 * @param observableOn
 * @param observableOff
 * @returns {Function}
 */
function stateToObservable (observableOn, observableOff) {
    return function (state) {
        return state ? observableOn : observableOff
    }
}

function toLightResult (light) {
    //console.log('light', light);
    return light.result();
}

function toApi (light) {
    //console.log('light', light);
    api.colors.set(light);
}