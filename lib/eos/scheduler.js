/**
 * Created by rulkens on 29/04/15.
 */
'use strict';

var Action = require('./action'),
    inherits = require('inherits'),
    EventEmitter = require('events').EventEmitter,
    _ = require('lodash'),
    Eos = require('./client/eos');

var defaults = {
    framerate: 60
};

var Scheduler = function (options) {
    this.actions = [];

    _.defaults(this, defaults);
    _.extend(this, options);

    this.on('start', this.start);
    this.on('stop', this.stop);
    this.driver = options.driver || new Eos();
    this.driver.on('data', function(data){
        console.log('scheduler data received', data);
    });
};

inherits(Scheduler, EventEmitter);

Scheduler.prototype.start = function () {
    this.interval = setInterval(this.step.bind(this), 1000.0 / this.framerate);
    console.log('Scheduler started');
};

Scheduler.prototype.stop = function () {
    console.log('Scheduler stopped');
    this.interval && clearInterval(this.interval);
};

Scheduler.prototype.step = function () {
    console.log('Scheduler step');
    var emptyArray = function (size, value) {
            return Array.apply(null, new Array(numLights)).map(Number.prototype.valueOf,value || 0)
        },
        sumArrays = function (a1, a2) {
            return a1.map(function (item, index) {
                return a1[index] + a2[index];
            })
        };

    var numLights = this.driver.numLights;

    var result = this.actions.map(function(action){
        return action.step();
    });

    // add all the values
    result = result.reduce(function(memo, res){
        return sumArrays(memo, res);
    }, emptyArray(numLights));
    console.log('summing result', result);

    this.driver.api('set', result);
};

/**
 * add an action to the scheduler
 * by name or as object
 *
 * @param action
 */
Scheduler.prototype.add = function (action) {
    if(_.isString(action)){
        action = new action();
    }
    // TODO: check if the action is already in the array
    this.actions.push(action);

    return action;
};

module.exports = Scheduler;