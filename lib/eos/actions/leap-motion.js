/**
 * Example Leap Motion action
 */
'use strict';
var inherits = require('inherits'),
    _ = require('lodash'),
    Action = require('../action'),
    Light = require('../light'),
    util = require('../util'),
    leapjs      = require('leapjs');

var controller  = new leapjs.Controller({enableGestures: true});

module.exports = LeapController;

inherits(LeapController, Action);

LeapController.prototype.step = step;

var defaults = {
    speed: 2.0, // in lights per second
    size: 4.0,
    intensity: 0.9
};

function LeapController(){

    var light = new Light(_.extend({ intensity: 0.0, position: 0.5 }, defaults));
    this.light = light;

    var numFingers = 0;

    controller.on('connect', function() {
        console.log("[LeapMotion] Successfully connected.");
        light.intensity = 0.5;
    });

    controller.on('streamingStarted', function() {
        console.log("[LeapMotion] Streaming started");
        light.intensity = 1;
    });

    controller.on('streamingStopped', function() {
        console.log("[LeapMotion] Streaming stopped");
        light.intensity = 0;
    });

    controller.on('deviceFrame', function(frame) {
        //console.log("[LeapMotion] Streaming frame");

        var numberOfFingers = frame.fingers.length;

        if(numFingers !== numberOfFingers){
            console.log(numberOfFingers);
            // only log on change
        }

        numFingers = frame.fingers.length;

        mapGestures(frame.gestures, light);

        light.intensity = numberOfFingers / 10;
    });

    controller.connect();
}

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
}
function step (){
    return this.light.result();
}

