/**
 * Created by rulkens on 29/04/15.
 */
'use strict';

var EventEmitter = require('events').EventEmitter,
    inherits = require('inherits'),
    _ = require('lodash');

var Action = function(options){
    this.scheduler = options.scheduler;
};

inherits(Action, EventEmitter);

Action.prototype.start = function(){
    this.scheduler.startAction(this);
};

Action.prototype.stop = function(){
    this.scheduler.stopAction(this);
};

Action.prototype.step = function () {

}

module.exports = Action;