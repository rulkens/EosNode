/**
 * not working!
 */
var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker'),
    AudioContext = require('web-audio-api').AudioContext,
    AudioNode = require('web-audio-api').AudioNode,
    context = new AudioContext(),
    FrequencyAnalyzer = require('./lib/audio/FrequencyAnalyzer'),
    fft = require('fft');

context.outStream = new Speaker({
    channels: context.format.numberOfChannels,
    bitDepth: context.format.bitDepth,
    sampleRate: context.sampleRate
});

// this one only works by patching the Speaker class to emit a 'write' event every time the write function is called
context.outStream.on('write', function (data) {
    console.log('data chunk', data.length);
    var f = new fft.complex(1, false);
    //f.process()
});

fs.createReadStream('eye.mp3')
    .pipe(new lame.Decoder())
    .on('format', function (format) {
        console.log('format', format);
        this.pipe(context.outStream);
    })
    .on('data', function (data) {
        console.log('data', data.length);
    });

console.log('context.destination', context.destination);