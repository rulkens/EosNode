/**
 * Created by rulkens on 29/04/15.
 */
var Light = require('./light');

module.exports = function (eos) {
    // some light debug stuff
    var l = new Light({
            size: 5,
            position:0.5
        }),
        result = l.result();

    console.log( result );
    eos.api( 'set', result );
};