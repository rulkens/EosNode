/**
 * simple example of sparkles observable
 */
var settings  = require('../settings'),
    Api       = require('../lib/eos/api'),
    colorUtil = require('../lib/eos/util/util.color.js'),
    Sparkles$ = require('../lib/eos/actions.rx/sparkles.color.observable'),
    numLights = require('../lib/eos/light.color').defaults.numLights,
    rxUtil    = require('../lib/eos/util/util.rx.js'),
    palettes  = require('../lib/eos/gradients');

var sparklesSettings = [
    {chance : .09, intensity: .1, palette : palettes.aquaMarine},
    {chance : .01, palette : palettes.crazyOrange}
];

var // default
    //sparkles = Sparkles()
    // with a specific color
    //sparkles$ = Sparkles$({color : 0xFF0000}) // red
    // with palette
    sparkles$ = rxUtil.combineColors(sparklesSettings.map((setting) => Sparkles$(setting)))
        .map(colorUtil.correctColors)
        // fade
        //.throttle(100)
        .scan(colorUtil.fadeColors({ratio : .98, fastOn : true}), numLights);

Api(settings).connect(run);

function run (api) {
    sparkles$.subscribe(toApi);

    function toApi (light) {
        //console.log('light', light);
        api.colors.set(light);
    }
}
