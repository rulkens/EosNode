/**
 * simple example of swipe observable
 */
var settings = require('../settings'),
    Api      = require('../lib/eos/api'),
    Swipe    = require('../lib/eos/actions.rx/swipe.observable');

var api   = Api(settings),
    swipe = Swipe({ color: 0x00FF00, size: 60 });

swipe.subscribe(function (val) {
    console.log('val', val);
});

swipe.subscribe(toApi);

function toApi (light) {
    //console.log('light', light);
    api.colors.set(light);
}
