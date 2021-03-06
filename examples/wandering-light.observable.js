/**
 * simple example of light observable
 */
var settings  = require('../settings'),
    Api       = require('../lib/eos/api'),
    colorUtil = require('../lib/eos/util/util.color.js'),
    WanderingLight$     = require('../lib/eos/actions.rx/wandering-light.observable'),
    numLights = require('../lib/eos/light.color').defaults.numLights;

var lightSettings = {
};

var api = Api(settings),
    light$ = WanderingLight$(lightSettings).map(toResult);


light$.subscribe(toApi);

function toApi (colors){
    api.colors.set(colors);
}


function toResult (light) {
    return light.result();
}
