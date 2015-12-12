/**
 * Created by rulkens on 06/12/15.
 */
var Rx     = require('rx'),
    leapjs = require('leapjs');

module.exports = {
    controller       : controller,
    connected        : connected,
    streamingStarted : streamingStarted,
    streamingStopped : streamingStopped,
    frame            : frame,
    hands            : hands,
    hand             : hand,
    handOn           : handOn,
    handOff          : handOff,
    handState        : handState
};

// only variable is the controller
var c;

function controller () {
    if (!c) {
        c = new leapjs.Controller();
        c.connect();
    }
    return c;
}

function connected () {
    return Rx.Observable.fromEvent(controller(), 'connect');
}

function streamingStarted () {
    return Rx.Observable.fromEvent(controller(), 'streamingStarted');
}

function streamingStopped () {
    return Rx.Observable.fromEvent(controller(), 'streamingStopped');
}

function frame () {
    return Rx.Observable
        .fromEvent(controller(), 'frame');
}

/**
 * detect hands
 *
 * @returns Rx.Observable<Hand[]>
 */
function hands () {
    return frame()
    // only include frames where there is more than one hand
        .filter(function (frame) {
            return frame.hands ? frame.hands.length > 0 : false
        })
        .map(function (frame) {
            return frame.hands
        });
}

/**
 * get a stream of a hand with a specific type
 * 
 * @param type
 * @returns {Observable<Hand>}
 */
function hand (type) {
    return hands()
        .filter(handType(type))
        .map(getHand(type));
}

/**
 *
 * @param type 'left' or 'right'
 */
function handOn (type){
    return handState(type).filter(function (state) {
        return state === true;
    }).map(() => true);
}

/**
 * a stream of boolean true values every time a hand with the specific type is removed from
 * @param type
 * @returns {Rx.Observable<True>}
 */
function handOff (type){
    return handState(type).filter(function (state) {
        return state === false;
    }).map(() => true);
}



/**
 * checks the falling edge of the hand signal.
 *
 * @param type 'left' or 'right'
 * @returns {Function<Boolean>}
 */
function handState (type){
    return frame().map(handInFrame(type)).distinctUntilChanged();

    function handInFrame (type){
        return function (frame) {
            var ret = frame.hands.some(function (hand) {
                return hand.type === type;
            });
            return ret;
        }
    }
}



// PRIVATE FUNCTIONS
/**
 * check if a certain type of hand is available in the hand array
 * @param type
 * @returns {Function}
 */
function handType (type) {
    return function (hands) {
        return hands.filter(function (hand) {
                return hand.type === type
            }).length > 0;
    }
}

function getHand (type) {
    return function (hands) {
        for (i in hands) {
            if (hands[i].type === type) return hands[i];
        }
    }

}