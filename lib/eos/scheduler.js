/**
 * Scheduler object.
 */
'use strict';

var inherits     = require('inherits'),
    EventEmitter = require('events').EventEmitter,
    _            = require('lodash'),
    Api          = require('./api'),
    util         = require('./util'),
    colorUtil    = require('./util.color');

var defaults = {
    frameRate     : 30,
    numLights     : 32,
    numColors     : 120,
    panicInterval : 200000
};

module.exports = Scheduler;

inherits(Scheduler, EventEmitter);

// PUBLIC INTERFACE
Scheduler.prototype.start = start;
Scheduler.prototype.stop = stop;
Scheduler.prototype.add = add;

function Scheduler (options) {
    this.actions = [];
    options = options || {};

    _.defaults(this, defaults);
    _.extend(this, options);

    this.on('start', this.start);
    this.on('stop', this.stop);
    this.api = options.api || new Api();
    this.api.on('data', function (data) {
        //console.log('scheduler data received', data);
    });
}

function start () {

    var that = this;

    // start the animation loop
    this.interval = setInterval(step(this.actions, this.api), 1000.0 / this.frameRate);
    console.log('Scheduler started');

    // TODO: build in a sort of reset switch
    // sort of watch-dog timer?
    this.panicInterval = setInterval(function () {
        that.api.panic();
    }, this.panicInterval);

    return this;
}

function stop () {
    console.log('Scheduler stopped');
    clearInterval(this.interval);
    //console.log('this.interval', this.interval);
    clearInterval(this.panicInterval);
    return this;
}

/**
 * add an action to the scheduler
 * by name or as object
 *
 * @param action
 */
function add (action) {
    var a        = action,
        wasEmpty = this.actions.length === 0;

    if (_.isString(a)) {
        // try to include the action and create a new instance
        try {
            a = require('./actions/' + action);
            a = new a();
            console.log('adding action', action);
        } catch (e) {
            console.error('adding action failed!', action, e);
        }
    }
    // TODO: check if the action is already in the array
    this.actions.push(a);

    // add listener to forced execution
    a.on('frame', step(this.actions, this.api));
    a.on('end', end(this.actions, a, this));

    //if(wasEmpty) this.start();

    return a;
}

// PRIVATE FUNCTIONS

// actual step function, returns a function that executes one step and sets the api values
function step (actions, api) {
    return function () {
        //console.log('animation frame!');
        var lights = actions.reduce(stepValues('light'), []);
        var colors = actions.reduce(stepValues('color'), []);

        console.log('lights', lights);
        //console.log('colors', colors);

        // TODO: the order seems to matter, only the first api call will get registered

        if (colors.length > 0) {
            //console.log('setting colors');
            var totalColor = colorUtil.sumColorArrays(colors);
            api.colors.set(totalColor);
        }

        if (lights.length > 0) {
            //console.log('setting lights');
            var totalLight = util.sumIlluminances(lights);
            api.lights.set(totalLight);
        }

        /**
         * returns a reduce function
         *
         * @param key
         * @returns {Function}
         */
        function stepValues (key) {
            return function (prev, action) {
                var res = action.step();
                if (res.hasOwnProperty(key)) {
                    prev.push(res[key]);
                    return prev;
                }
                return prev;
            }
        }
    }
}

/**
 * gets executed when an action requests to be ended
 *
 * stops the scheduler when there are no more actions left
 *
 * @param action
 */
function end (actions, action, scheduler) {
    return function () {

        // remove action from array
        scheduler.actions = _.without(actions, action);
        var noMoreActionsLeft = scheduler.actions.length === 0;

        if (noMoreActionsLeft) scheduler.stop();

        console.log('removing action', action);
        console.log('number of actions left:', scheduler.actions.length);
    }


}
