/**
 * Example Leap Motion action
 */
'use strict';
var inherits   = require('inherits'),
    _          = require('lodash'),
    Action     = require('../action'),
    ColorLight = require('../light.color'),
    util       = require('../util/util'),
    colorUtil  = require('../util/util.color.js'),
    Color      = require('color'),
    notifier   = require('node-notifier');

module.exports = LeapController;

inherits(LeapController, Action);

LeapController.prototype.step = step;

var defaults = {
    size      : 40.0,
    intensity : 2.0,
    position  : 0.5,
    color     : 0xFF0000
};

function LeapController (options) {
    if (!(this instanceof LeapController)) return new LeapController(options);

    _.defaults(this, defaults);
    _.extend(this, options);

    var that = this;

    var controller = new leapjs.Controller({enableGestures : true});
    var lights = [
        ColorLight(_.extend({}, defaults)),
        ColorLight(_.extend({}, defaults))];

    this.lights = lights;

    var numFingers = 0,
        numHands   = 0;

    controller.on('connect', function () {
        console.log("[LeapMotion] Connected.");
        notifier.notify({title : 'EOS', message : 'Leap Motion connected'});
        lights[0].intensity = defaults.intensity / 2;
        lights[1].intensity = defaults.intensity / 2;
    });

    controller.on('disconnect', function () {
        console.log("[LeapMotion] Disconnected.");
        notifier.notify({title : 'EOS', message : 'Leap Motion disconnected'});
    });

    controller.on('streamingStarted', function () {
        console.log("[LeapMotion] Streaming started");
        lights[0].intensity = defaults.intensity;
        lights[1].intensity = defaults.intensity;
    });

    controller.on('streamingStopped', function () {
        console.log("[LeapMotion] Streaming stopped");
        lights[0].intensity = 0;
        lights[1].intensity = 0;
    });

    controller.on('frame', function (frame) {
        //console.log("[LeapMotion] Streaming frame");

        if (numFingers !== frame.fingers.length) {
            console.log('new number of fingers detected: ', frame.fingers.length);
            // only log on change
        }

        numFingers = frame.fingers.length;
        numHands = frame.hands.length;

        //light.intensity = numberOfFingers / 10;

        //_.extend(light, mapGestures(frame.gestures));

        //console.log('frame.hands.length', frame.hands.length);

        // do something with one hand
        if (frame.hands.length === 1) {
            _.extend(lights[0], mapOneHand(frame.hands[0]));
            // fade out the other light
            lights[1].intensity = lights[1].intensity * .9;
        }

        // do something with two hands
        if (frame.hands.length === 2) {
            var lightValues = mapTwoHands(frame.hands);

            // copy values to the light
            _.extend(lights[0], lightValues[0]);
            _.extend(lights[1], lightValues[1]);

            lights[1].intensity = util.clip(lights[1].intensity + .02);
        }

        // send a frame command to the scheduler
        that.emit('frame');
    });

    controller.connect();
}

function step () {
    return {color : colorUtil.sumColorArrays()(this.lights.map(light => light.result()))};
}

/**
 * maps one hands position to the light intensity and position
 *
 * @param hand
 * @param light
 */
function mapOneHand (hand, mirror) {

    // make sure only reliable measurements get included
    if (hand.confidence < 0.3) return {};

    console.log('hand.confidence', hand.confidence);
    //console.log('hand.palmPosition', hand.palmPosition);

    // map Y to light Position
    var xPos         = hand.palmPosition[0],
        yPos         = (hand.palmPosition[1] - 100) / 400,
        zPos         = util.clip((hand.palmPosition[2] + 100) / 500),
        yaw          = hand.yaw(),
        roll         = (hand.roll() / (Math.PI * 2)) + .5,
        rollNorm     = (roll - .3) * 1.3,
        hue          = (roll * 360) % 360,
        //rotationAngle = hand.rotationAngle(),
        // hand grabstrength = intensity (more grabbing is less intensity)
        size         = (1 - hand.grabStrength) * defaults.size,
        color        = Color({hue : hue, saturation : 100 * zPos, value : 100}),
        newLightVals = {position : yPos, size : size, color : colorUtil.colorToInt(color)};

    console.log('color', color);
    console.log('xPos', xPos);
    console.log('color.saturation', color.saturation());
    console.log('zPos', zPos);
    console.log('rollNorm', rollNorm);
    console.log('roll', roll);
    console.log('hue', hue);
    //console.log('rotationAngle', rotationAngle);
    console.log('1h newLightVals', newLightVals);

    return newLightVals;
}

function mapTwoHands (hands) {
    // make sure only reliable measurements get included
    if (hands[0].confidence < 0.3) return [];

    return [mapOneHand(hands[0]), mapOneHand(hands[1], true)];
}

/**
 * maps gestures to light actions
 *
 * @param gestures
 * @param light
 */
function mapGestures (gestures, light) {
    // loop through available gestures
    for (var i = 0; i < gestures.length; i++) {
        var gesture = gestures[i];
        var type = gesture.type;

        switch (type) {

            case "circle":
                if (gesture.state == "stop") {
                    console.log('circle');
                }
                break;

            case "swipe":
                if (gesture.state == "stop") {
                    console.log('swipe');

                    // reset position
                    return {position : 0};
                }
                break;

            case "screenTap":
                if (gesture.state == "stop") {
                    console.log('screenTap');
                }
                break;

            case "keyTap":
                if (gesture.state == "stop") {
                    console.log('keyTap');
                }
                break;

        }
    }

    return {};
}

