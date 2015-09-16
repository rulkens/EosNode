/**
 * Created by rulkens on 29/04/15.
 */
var Scheduler     = require('./scheduler');

module.exports = function (api) {
    var s = new Scheduler({api : api});

    //s.add('binary-clock');
    //s.add('blink');
    //s.add('pong.color');
    //s.add('off');
    //s.add('pong.color');
    s.add('light.color');
    /*s.add('blink', {
        startIn: '10s',
        endsIn: '20s'
    });*/

    s.start();
    return s;
};
