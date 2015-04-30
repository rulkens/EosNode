/**
 * Created by rulkens on 29/04/15.
 */
'use strict';

var Action = require('../action'),
    inherits = require('inherits'),
    EventEmitter = require('events').EventEmitter;

var Glow = function(){

};

Glow.prototype.step = function () {

};

inherits(Glow, EventEmitter);