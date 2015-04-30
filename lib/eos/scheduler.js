/**
 * Created by rulkens on 29/04/15.
 */
'use strict';

var inherits = require('inherits'),
    EventEmitter = require('events').EventEmitter,
    _ = require('lodash'),
    Eos = require('./client/eos'),
    util = require('./util');

var defaults = {
    frameRate: 15,
    numLights: 32
};

var Scheduler = function (options) {
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
};

inherits(Scheduler, EventEmitter);

Scheduler.prototype.start = function () {
    this.interval = setInterval(this.step.bind(this), 1000.0 / this.frameRate);
    console.log('Scheduler started');
};

Scheduler.prototype.stop = function () {
    console.log('Scheduler stopped');
    this.interval && clearInterval(this.interval);
};

Scheduler.prototype.step = function () {

    var result = this.actions.map(function(action){
        return action.step();
    });

    // add all the values
    result = util.sumIlluminances(result);

    // TODO: move this somewhere else
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