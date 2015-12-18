/**
 * simple example of sparkles observable
 */
var settings  = require('../settings'),
    Api       = require('../lib/eos/api'),
    colorUtil = require('../lib/eos/util/util.color.js'),
    Sparkles  = require('../lib/eos/actions.rx/sparkles.color.observable'),
    numLights = require('../lib/eos/light.color').defaults.numLights,
    palettes = require('../lib/eos/gradients');

var api      = Api(settings),
    // default
    //sparkles = Sparkles()
    // with a specific color
    //sparkles = Sparkles({color: 0xFF0000}) // red
    // with palette
    sparkles = Sparkles({palette : palettes.instagram })
    // fade
        .scan(colorUtil.fadeColors({fastOn : true}), numLights);

api.connect(run);

function run (){
    sparkles.subscribe(toApi);

    function toApi (light) {
        //console.log('light', light);
        api.colors.set(light);
    }
}
