/**
 * Scheduler object.
 */
'use strict';

var inherits = require('inherits'),
    EventEmitter = require('events').EventEmitter,
    _ = require('lodash'),
    Api = require('./api'),
    util = require('./util');

var defaults = {
    frameRate: 30,
    numLights: 32,
    numColors: 120,
    panicInterval: 200000
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
    this.api = options.api || new Api();
    this.api.on('data', function(data){
        //console.log('scheduler data received', data);
    });
}

function start() {

    var that = this;

    // start the animation loop
    this.interval = setInterval(step(this.actions, this.api), 1000.0 / this.frameRate);
    console.log('Scheduler started');

    // TODO: build in a sort of reset switch
    // sort of watch-dog timer?
    setInterval(function(){
        that.api.panic();
    }, this.panicInterval);

    return this;
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

    // add listener to forced execution
    action.on('frame', step(this.actions, this.api));

    return action;
}

// PRIVATE FUNCTIONS

// actual step function, returns a function that executes one step and sets the api values
function step(actions, api) {
    return function(){
        //console.log('animation frame!');
        var lights = actions.reduce(stepValues('light'), []);
        var colors = actions.reduce(stepValues('colors'), []);

        // add all the values
        // TODO: let the user choose what to do with the values (i.e. subtract or min/max)
        var totalLight = util.sumIlluminances(lights);
        var totalColor = util.sumColors(colors);

        // TODO: move this somewhere else
        api.lights.set(totalLight);
        api.colors.set(totalColor);

        function stepValues(key){
            return function(prev, action){
                var res = action.step();
                if(res.hasOwnProperty(key)){
                    prev.push(res[key]);
                    return prev;
                }
                return prev;
            }
        }
    }
}
