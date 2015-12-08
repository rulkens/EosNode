var Arduio = require('../lib/eos/client/arduio'),
    colors = require('colors');

var client = new Arduio();

client.on('connect', function () {
    console.log('connected!'.blue);
});

client.on('data', function (data) {
    console.log('data', data);
});