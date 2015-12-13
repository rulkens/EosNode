/**
 * simple example of sparkles observable
 */
var settings  = require('../settings'),
    Api       = require('../lib/eos/api'),
    colorUtil = require('../lib/eos/util/util.color.js'),
    Sparkles  = require('../lib/eos/actions.rx/sparkles.color.observable'),
    numLights = require('../lib/eos/light.color').defaults.numLights;

var api      = new Api(settings).connect(),
    sparkles = Sparkles({color : 0x77FFFF})
    // fade
        .scan(colorUtil.fadeColors({fastOn : true}), numLights);

//sparkles.subscribe(function (val) {
//    console.log('val', val);
//});

sparkles.subscribe(toApi);

function toApi (light) {
    //console.log('light', light);
    api.colors.set(light);
}
