/**
 * Created by rulkens on 29/04/15.
 */
var Scheduler     = require('./scheduler');

module.exports = function (api) {
    var s = Scheduler({api : api, frameRate : 60});

    //s.add('binary-clock');
    //s.add('blink');
    //s.add('binary-clock');
    //s.add('analogue-clock');
    //s.add('analogue-clock.color');
    //s.add('off');
    //s.add('pong.color');
    //s.add('light.color');
    //s.add('rainbow');
    //s.add('blink');
    s.add('leap-motion.color');
    /*s.add('blink', {
        startIn: '10s',
        endsIn: '20s'
    });*/

    s.start();
    return s;
};
