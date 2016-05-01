/**
 * simple example of ripple observable
 */
var settings  = require('../settings'),
    Api       = require('../lib/eos/api'),
    colorUtil = require('../lib/eos/util/util.color.js'),
    Ripple$    = require('../lib/eos/actions.rx/ripple.color.observable'),
    numLights = require('../lib/eos/light.color').defaults.numLights;

/**
 * connect with the
 */
Api(settings).connect(run);

function run (api) {

    var rippleSettings = {
        fps        : 60.0,
        length     : 30,
        waveLength : .5,
        palette : [0x0, 0xFF, 0xFFFF], // a palette to use instead of just a color
        //light      : {
        //    color : 0xE5FFFF,
        //    size  : 4
        //},
        position   : .5,
        width      : .4,

    };

    /*
    this is the actual observable. We can give it some initial settings.
     */
    var ripple$ = Ripple$(rippleSettings).map(colorUtil.correctColors);
    // with a specific color
    //ripple = Ripple({color: 0xFF0000}) // red
    // with palette
    //ripple = Ripple({palette : palettes.crazyOrange })
    // fade
    //.scan(colorUtil.fadeColors({fastOn : true}), numLights);

    // we subscribe to the observable, so every time `ripple$` produces a value, it is sent
    // to the api
    ripple$.subscribe(api.colors.set.bind(api));
}
