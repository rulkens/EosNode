/**
 * Uses a
 * TODO: implement
 */
'use strict';

var Action       = require('../action'),
    inherits     = require('inherits'),
    EventEmitter = require('events').EventEmitter;

module.exports = Glow;

var defaults = {

};

inherits(Glow, Action);

Glow.prototype.step = step;

function Glow(options){
    Action.prototype.constructor.apply(this, arguments);

    _.defaults(this, defaults);
    _.extend(this, options);
}

function step () {
    throw new Error('not implemented!');
}