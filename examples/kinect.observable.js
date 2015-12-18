/**
 * connect to the Kinect using Ni Mate and the OSC protocol.
 * be sure to set the
 */
'use strict';
var Rx         = require('Rx'),
    _          = require('lodash'),
    osc        = require('osc'),
    Color      = require('color'),
    settings   = require('../settings'),
    Api        = require('../lib/eos/api'),
    rxUtil     = require('../lib/eos/util/util.rx.js'),
    ColorLight = require('../lib/eos/light.color'),
    LightOff$  = require('../lib/eos/actions.rx/light.color.observable').offLoop(),
    colorUtil  = require('../lib/eos/util/util.color.js'),
    numLights  = require('../lib/eos/light.color').defaults.numLights;

var api    = Api(settings),
    kinect = new osc.UDPPort({
        localAddress : settings.kinect.host,
        localPort    : settings.kinect.port
    });

api.connect(run);

function run (){
    console.log('starting!');

    var validAddresses = ['/joint_Left_Hand_1', '/joint_Right_Hand_1'];

// Listen for incoming OSC bundles.
    kinect.on("bundle", function (oscBundle) {
        console.log("An OSC bundle just arrived!", oscBundle);
    });

    var hands = Rx.Observable.fromEvent(kinect, 'osc')
        .filter(function (message) {
            return validAddresses.indexOf(message.address) >= 0;
        });

    var leftHand = hands
        .filter(function (message) {
            return message.address.indexOf('Left') >= 0;
        })
        .map(message => message.args)
        .startWith([0,0,0])

    var rightHand = hands
        .filter(function (message) {
            return message.address.indexOf('Right') >= 0;
        })
        .map(message => message.args)
        .startWith([0,0,0])

    var leftLight = leftHand.map(handToLight).map(toResult);
    var rightLight = rightHand.map(handToLight).map(toResult);

    var colorsCombined = rxUtil
        .combineColors([
            LightOff$, leftLight, rightLight
        ])
        .throttle(16)
        // fade stuff
        .scan(colorUtil.fadeColors({fastOn : true}), numLights);

    colorsCombined.subscribe(toApi);

    // DEBUG
    //colorsCombined.timeInterval().map((i) => i.interval).subscribe((interval) => console.log('interval', toHashes(interval/30)));

    // Open the socket.
    kinect.open();

    function handToLight (pos) {
        var light = ColorLight();
        //console.log(toHashes(pos[1]));
        light.position = pos[1]; // / 2;
        //light.color = colorUtil.colorToInt(Color({h: (360 * ((2 + pos[0]) % 1)), s: 100, v: 100}));

        // start with red in the middle, symmetric towards both sides
        light.color = colorUtil.colorToInt(Color({h : (360 * Math.abs(pos[0] % 1)), s : 100, v : 100}));
        return light;
    }

    function toApi (colors) {
        api.colors.set(colors);
    }

    function toHashes (i) {
        return (new Array(Math.floor(i * 40))).join('#');
    }

    function toResult (light) {
        return light.result();
    }
}