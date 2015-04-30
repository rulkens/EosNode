/**
 * Created by rulkens on 29/04/15.
 */
'use strict';

var EventEmitter = require('events').EventEmitter,
    inherits = require('inherits'),
    _ = require('lodash');

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