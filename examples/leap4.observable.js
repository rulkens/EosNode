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
    Ripple$    = require('../lib/eos/actions.rx/ripple.color.observable'),
    numLights = require('../lib/eos/light.color').defaults.numLights,
    gradients = require('../lib/eos/gradients');

var api = Api(settings);

var settings = {
    confidence : .3,

    sparkles : {
        chance : .01,
        color  : 0xFFFFFF
    },

    ripple : {
        length     : .6,
        waveLength : .6,
        light      : {
            intensity : .9
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

var handsCombined = rxUtil
    .combineColors([
        sparklesWhenNoHands$(),
        rippleOnHandOn$('left'),
        rippleOnHandOn$('right'),
        handLight$('left', settings.lights.left),
        handLight$('right', settings.lights.right)
    ], 'add')
    .throttle(1000/60) // to 60fps
    // fade stuff
    .scan(colorUtil.fadeColors({fastOn : true}), numLights)
    //.map(colorUtil.correctColors);
// start empty
//.startWith(Light.allLightsOff);

// DEBUG INFO
leap.connected().subscribe(() => console.log('connected'));
leap.streamingStarted().subscribe(() => console.log('streamingStarted'));
leap.streamingStopped().subscribe(() => console.log('streamingStopped'));

//leftAppear.subscribe(toApi);
leap.handOn('left').subscribe(() => console.log('left hand on'));
leap.handOn('right').subscribe(() => console.log('right hand animation'));

// send to the api
handsCombined.subscribe(toApi);

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
        .map(toLightResult)

    /**
     *
     * @param state
     * @returns {Light$}
     */
    function stateToLight$ (handType, lightSettings) {

        var lightOn = Light(lightSettings)
            .withLatestFrom(handToLight$(handType), overrideLightSettings)
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
                var o = options || {};

                return function (hand) {
                    if (!hand) return {intensity : 0}; // return a light that is off

                    // map Y to light Position
                    var pos   = normPalmPos(hand.palmPosition),
                        // hand grabstrength = intensity (more grabbing is less intensity)
                        size  = (1 - hand.grabStrength),
                        color = rollToColor(hand.roll());

                    //console.log('zPos', zPos);
                    return {position : pos.y, intensity : util.clip(1 - pos.z), color : color };
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
        .startWith(false)
        .map(state => !state) // inverse state
        .flatMapLatest(stateToSparkles$(options));

    function stateToSparkles$ (options) {
        return stateToObservable(Sparkles(options).concat(Light.off()), Light.off());
    }
}

function rippleOnHandOn$ (handType, rippleOptions) {
    return leap.handOn(handType)
        .startWith(true)
        .withLatestFrom(leap.hand(handType), function (o, hand) {
            return hand;
        }) // get the hand data
        .flatMapLatest(handOnToRipple$(rippleOptions));

    function handOnToRipple$ (rippleOptions) {
        return function (hand) {
            console.log('hand.palmPosition', hand.palmPosition);
            return Ripple$(
                _.extend(rippleOptions,
                    {
                        position : normPalmPos(hand.palmPosition).y,
                        light    : {
                            intensity : settings.ripple.light.intensity,
                            //size: 5 * (1 - hand.grabStrength),
                            color     : rollToColor(hand.roll())
                        }
                    })
            );
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

function rollToColor (roll) {
    var val = (roll / (Math.PI * 2)) + .5;
    var hue = (val * 360) % 360;
    return colorUtil.colorToInt(
        Color({hue : hue, saturation : 100, value : 50})
    );
}

function normPalmPos (palmPosition) {
    return {
        x : palmPosition[0] / 400,
        y : (palmPosition[1] - 100) / 350,
        z : (palmPosition[2]) / 200
    }
}