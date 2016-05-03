/**
 * simple example of rainbow observable
 */
var settings = require('../settings'),
    Api      = require('../lib/eos/api'),
    Rainbow    = require('../lib/eos/actions.rx/rainbow.observable');

var api   = Api(settings),
    rainbow = Rainbow({
        fps        : 60,
        waveLength : 2,
        direction  : 'down', //from bottom to top, can be 'up' or 'down'
        scaling    : 1,
        intensity  : .6,
        saturation : .5
    });

rainbow.subscribe(function (val) {
    //console.log('val', val);
}, function (e) {
    console.log('error!', e);
});

rainbow.subscribe(toApi);

function toApi (light) {
    //console.log('light', light);
    api.colors.set(light);
}
