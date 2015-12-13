/**
 * Example Leap Motion action
 */
'use strict';
var inherits = require('inherits'),
    _        = require('lodash'),
    Action   = require('../action'),
    Light    = require('../light'),
    util     = require('../util/util'),
    leapjs   = require('leapjs'),
    notifier = require('node-notifier');

module.exports = LeapController;

inherits(LeapController, Action);

LeapController.prototype.step = step;

var defaults = {
    speed: 2.0, // in lights per second
    size: 6.0,
    intensity: 2.0
};

function LeapController(){

    var that = this;

    var controller  = new leapjs.Controller({enableGestures: true});
    var light = new Light(_.extend({ intensity: 0.0, position: 0.5 }, defaults));

    this.light = light;

    var numFingers = 0,
        numHands = 0;

    controller.on('connect', function() {
        console.log("[LeapMotion] Successfully connected.");
        notifier.notify({ title: 'EOS', message: 'Leap Motion connected'});
        light.intensity = 0.5;
    });

    controller.on('disconnect', function () {
        notifier.notify({ title: 'EOS', message: 'Leap Motion disconnected'});
    });

    controller.on('streamingStarted', function() {
        console.log("[LeapMotion] Streaming started");
        light.intensity = 1;
    });

    controller.on('streamingStopped', function() {
        console.log("[LeapMotion] Streaming stopped");
        light.intensity = 0;
    });

    controller.on('frame', function(frame) {
        //console.log("[LeapMotion] Streaming frame");

        if(numFingers !== frame.fingers.length){
            console.log('new number of fingers detected: ', frame.fingers.length);
            // only log on change
        }

        numFingers = frame.fingers.length;
        numHands = frame.hands.length;

        //light.intensity = numberOfFingers / 10;

        _.extend( light, mapGestures(frame.gestures));

        //console.log('frame.hands.length', frame.hands.length);

        // do something with one hand
        if(frame.hands.length === 1){
            _.extend( light, mapOneHand(frame.hands[0]));
        }

        // do something with two hands
        if(frame.hands.length === 2){
            _.extend( light, mapTwoHands(frame.hands));
        }

        // send a frame command to the scheduler
        that.emit('frame');
    });

    controller.connect();
}

/**
 * maps gestures to light actions
 *
 * @param gestures
 * @param light
 */
function mapGestures (gestures, light){
    // loop through available gestures
    for(var i = 0; i < gestures.length; i++){
        var gesture = gestures[i];
        var type    = gesture.type;

        switch( type ){

            case "circle":
                if (gesture.state == "stop") {
                    console.log('circle');
                }
                break;

            case "swipe":
                if (gesture.state == "stop") {
                    console.log('swipe');

                    // reset position
                    return { position: 0 };
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

/**
 * maps one hands position to the light intensity and position
 *
 * @param hand
 * @param light
 */
function mapOneHand (hand){

    // make sure only reliable measurements get included
    if(hand.confidence < 0.3) return {};

    console.log('hand.confidence', hand.confidence);
    //console.log('hand.palmPosition', hand.palmPosition);

    // map Y to light Position
    var position = (hand.palmPosition[1] - 100)/400,
        // hand grabstrength = intensity (more grabbing is less intensity)
        intensity = ((1-hand.grabStrength) * 2),
        newLightVals = { position: position, intensity: intensity };

    //console.log('1h newLightVals', newLightVals);

    return newLightVals;
}

function mapTwoHands (hands){

    // make sure only reliable measurements get included
    if(hands[0].confidence < 0.3) return {};

    // left hand = light position
    var position = (hands[0].palmPosition[1] - 100)/400,
        // distance between hands = intensity
        intensity = Math.sqrt(Math.abs(hands[0].palmPosition[0] - hands[1].palmPosition[0])/200),
        newLightVals = { position: position, intensity: intensity };

    //console.log('2h newLightVals', newLightVals);

    return newLightVals;
}

function step (){
    return { light: this.light.result() };
}
