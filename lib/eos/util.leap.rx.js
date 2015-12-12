/**
 * Leap Motion to Rx Observable
 *
 * [TESTS]
 *
 */

var _         = require('lodash'),
    Rx        = require('rx'),
    util      = require('./util'),
    colorUtil = require('./util.color'),
    leapjs     = require('leapjs');

module.exports = {
    observable : leapObservable
};

function leapObservable (){

}

//var controller = new leapjs.Controller();
//var connected = Rx.Observable.fromEvent(controller, 'connect');
/*
connected.subscribe(function next(){
    console.log('connected!!', connected);
});
    */