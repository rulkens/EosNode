/**
 * Created by rulkens on 29/04/15.
 */
var Light = require('./light'),
    Pong = require('./actions/pong'),
    Scheduler = require('./scheduler'),
    BinaryClock = require('./actions/binary-clock'),
    AnalogueClock = require('./actions/analogue-clock');

module.exports = function (eos) {
    // some light debug stuff
    //var l = new Light({
    //        size: 5,
    //        position:0.5
    //    }),
    //    result = l.result();
    //
    //console.log( result );
    //
    var s = new Scheduler();
    var pong1 = new Pong();
    var pong2 = new Pong({
        intensity:.5,
        speed:.5
    });

    var bc = new BinaryClock();
    var ac = new AnalogueClock();
    //s.add(pong1);
    //s.add(pong2);

    //s.add(bc);
    s.add(ac);

    s.start();
    //s.step();
};