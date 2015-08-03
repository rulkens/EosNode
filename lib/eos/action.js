/**
 * prototype for an action that can run on the scheduler. It can emit 'frame' events, which will
 * be picked up by the scheduler and sent to the driver. Or it can participate in the animation loop, returning
 * a list of light values in the `step` function.
 */
'use strict';

var EventEmitter = require('events').EventEmitter,
    inherits     = require('inherits'),
    _            = require('lodash');

var Action = function(options){
    options = options || {};
    this.scheduler = options.scheduler;

    // auto-add the action to the scheduler if it's given
    if(this.scheduler) this.scheduler.add(this);
};

inherits(Action, EventEmitter);

Action.prototype.step = function () {
    console.log('Default action step, please override');
};

module.exports = Action;