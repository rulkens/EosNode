var Eos = require('./lib/eos/api'),
    _ = require('lodash'),
    Light = require('./lib/eos/light');
    defaultProgram = require('./lib/eos/default-program');

var eos = new Eos();
var scheduler;

eos.connect(function() {
    eos.allOff();
    //defaultProgram(eos);
    console.log('connected!');

    // start the program in
    setTimeout(function(){
        scheduler = defaultProgram(eos);
    }, 2000);
});

// this should not happen, yet there will be some moment it inadvertently does
eos.on('error', function (err) {
    console.warn('This is impossible! an ERROR occurred', err);
});

// handle exits gracefully
process.on('SIGINT', function(){
    console.log('Turning off all lights');

    // turn off scheduler
    if(scheduler) scheduler.stop();
    eos.allOff();

    setTimeout(function(){
        eos.disconnect();
        process.exit();
    }, 0);

});
