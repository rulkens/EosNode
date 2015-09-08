/**
 *
 * @type {Eos|exports|module.exports}
 */
var Api = require('./eos/api'),
    _ = require('lodash'),
    Light = require('./eos/light'),
    defaultProgram = require('./eos/scheduler.default'),
    defaults = {
        startupTime: 2000 // ms till the program starts running
    };

/**
 * settings
 * - host
 * - program (function)
 * @param settings
 */
module.exports = function(options){

    var that = this;

    _.defaults(this, defaults);
    _.extend(this, options);

    var api = new Api(options);
    var scheduler;

    api.connect(function() {
        //api.lights.allOff();
        //api.colors.allOff();
        console.log('turning all lights on');
        api.lights.allOff();
        console.log('connected!');

        // start the program in
        setTimeout(function(){
            scheduler = (that.program && that.program(api)) || defaultProgram(api);
        }, this.startupTime);
    });

// this should not happen, yet there will be some moment it inadvertently does
    api.on('error', function (err) {
        console.warn('This is impossible! an ERROR occurred', err);
    });

// handle exits gracefully
    process.on('SIGINT', function(){
        console.log('Turning off all lights');

        // turn off scheduler
        if(scheduler) scheduler.stop();
        api.colors.allOff();
        api.lights.allOff();

        setTimeout(function(){
            api.disconnect();
            process.exit();
        }, 30);
    });

}