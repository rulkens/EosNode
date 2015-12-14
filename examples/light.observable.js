/**
 * simple example of light observable
 */
var settings  = require('../settings'),
    Api       = require('../lib/eos/api'),
    colorUtil = require('../lib/eos/util/util.color.js'),
    Light     = require('../lib/eos/actions.rx/light.color.observable'),
    numLights = require('../lib/eos/light.color').defaults.numLights;

var lightSettings = {
    wave: {
        scale: .5,
        offset: .5
    },
    light : {
        intensity: .1,
        color : 0xFFFF00
    }
};

var api = Api(settings),
    // default
    //light = Light()
    // with a specific color
    light$ = Light(lightSettings).map(toResult) // red
// fade
//    .scan(colorUtil.fadeColors({fastOn : true}), numLights);

//light.subscribe(function (val) {
//    console.log('val', val);
//});

light$.subscribe(toApi);


function toResult (light) {
    return light.result();
}
function toApi (light) {
    //console.log('light', light);
    api.colors.set(light);
}
