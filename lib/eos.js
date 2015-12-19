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

    var api = Api(options);
    var scheduler;

    api.connect(function() {
        //api.lights.allOff();
        //api.colors.allOff();
        console.log('[EOS]', 'turning all lights off'.blue);
        api.lights.allOff();
        api.colors.allOff();
        console.log('[EOS]', 'connected!'.green);

        // start the program (Scheduler) in a couple of seconds
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
        console.log('[EOS]', 'Turning all lights off'.blue);

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