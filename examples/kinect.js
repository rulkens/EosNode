/**
 * connect to the Kinect using Ni Mate and the OSC protocol.
 * be sure to set the
 */
'use strict';
var osc        = require('osc'),
    settings   = require('../settings'),
    Api        = require('../lib/eos/api'),
    ColorLight = require('../lib/eos/light.color'),
    Color = require('color'),
    colorUtil  = require('../lib/eos/util/util.color.js');

var api        = Api(settings),
    kinect     = new osc.UDPPort({
        localAddress : settings.kinect.host,
        localPort    : settings.kinect.port
    }),
    lightLeft  = ColorLight({color : 0xFF0000}),
    lightRight = ColorLight({color : 0x00FF00});


// Listen for incoming OSC bundles.
kinect.on("bundle", function (oscBundle) {
    console.log("An OSC bundle just arrived!", oscBundle);
});

kinect.on("osc", function onKinectMessage(message) {

    //console.log("An OSC message just arrived!", message);
    if (message.address === '/joint_Left_Hand_1') {
        //console.log('left hand detected!', message.args);
        handToLight(message.args, lightLeft);
    }
    if (message.address === '/joint_Right_Hand_1') {
        //console.log('right hand detected!', message.args);
        handToLight(message.args, lightRight);
    }

    if (message.address === '/joint_Left_Hand_1' || message.address === '/joint_Right_Hand_1') {
        // send to api
        var colors = colorUtil.sumColorArrays([lightLeft.result(), lightRight.result()]);
        toApi(colors);
    }
});

// Open the socket.
kinect.open();

function handToLight (pos, light) {
    //console.log(toHashes(pos[1]));
    light.position = pos[1]; // / 2;
    //light.color = colorUtil.colorToInt(Color({h: (360 * ((2 + pos[0]) % 1)), s: 100, v: 100}));
    light.color = colorUtil.colorToInt(Color({h: (360 * Math.abs(pos[0] % 1)), s: 100, v: 100}));
    return light;
}

function toApi (colors) {
    api.colors.set(colors);
}

function toHashes (i) {
    return (new Array(Math.floor(i * 40))).join('#');
}