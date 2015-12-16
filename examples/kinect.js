var osc = require('osc'),
    settings  = require('../settings'),
    Api       = require('../lib/eos/api'),
    ColorLight = require('../lib/eos/light.color'),
    colorUtil  = require('../lib/eos/util/util.color.js');

var api = Api(settings);
// Create an osc.js UDP Port listening on port 57121.
var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 7000
});

var lightLeft = ColorLight({ color: 0xFF0000 }),
    lightRight = ColorLight({ color: 0x00FF00 });

// Listen for incoming OSC bundles.
udpPort.on("bundle", function (oscBundle) {
    console.log("An OSC bundle just arrived!", oscBundle);
});

udpPort.on("osc", function (message) {

    //console.log("An OSC message just arrived!", message);
    if(message.address === '/joint_Left_Hand_1'){
        //console.log('left hand detected!', message.args);
        handToLight(message.args, lightLeft);
    }
    if(message.address === '/joint_Right_Hand_1'){
        //console.log('right hand detected!', message.args);
        handToLight(message.args, lightRight);
    }

    if(message.address === '/joint_Left_Hand_1' || message.address === '/joint_Right_Hand_1'){
        // send to api
        var colors = colorUtil.sumColorArrays([lightLeft.result(), lightRight.result()]);
        toApi(colors);
    }

});

// Open the socket.
udpPort.open();

// Send an OSC message to, say, SuperCollider
//udpPort.send({
//    address: "/s_new",
//    args: ["default", 100]
//}, "127.0.0.1", 57110);

function handToLight (pos, light){
    //console.log(toHashes(pos[1]));
    light.position = pos[1] / 2;
    return light;
}

function toApi(colors){
    api.colors.set(colors);
}

function toHashes (i) {
    return (new Array(Math.floor(i * 40))).join('#');
}