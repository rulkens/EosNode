/**
 * Scheduler object.
 */
'use strict';

var inherits = require('inherits'),
    EventEmitter = require('events').EventEmitter,
    _ = require('lodash'),
    Eos = require('./api'),
    util = require('./util');

var defaults = {
    frameRate: 30,
    numLights: 32
};

module.exports = Scheduler;

inherits(Scheduler, EventEmitter);

// PUBLIC INTERFACE
Scheduler.prototype.start = start;
Scheduler.prototype.stop  = stop;
Scheduler.prototype.add   = add;

function Scheduler(options) {
    this.actions = [];
    options = options || {};

    _.defaults(this, defaults);
    _.extend(this, options);

    this.on('start', this.start);
    this.on('stop', this.stop);
    this.driver = options.driver || new Eos();
    this.driver.on('data', function(data){
        //console.log('scheduler data received', data);
    });
}

function start() {
    this.interval = setInterval(step(this.actions, this.driver), 1000.0 / this.frameRate);
    console.log('Scheduler started');
    return this;

    // actual step function, returns a function that executes one step and sets the driver values
    function step(actions, driver) {
        return function(){
            var result = actions.map(function(action){
                return action.step();
            });

            // add all the values
            // TODO: let the user choose what to do with the values (i.e. subtract or min/max)
            result = util.sumIlluminances(result);

            // TODO: move this somewhere else
            driver.set(result);
        }
    }
}

function stop() {
    console.log('Scheduler stopped');
    if(this.interval) clearInterval(this.interval);
    return this;
}

/**
 * add an action to the scheduler
 * by name or as object
 *
 * @param action
 */
function add(action) {
    if(_.isString(action)){
        action = new action();
    }
    // TODO: check if the action is already in the array
    this.actions.push(action);

    return action;
}