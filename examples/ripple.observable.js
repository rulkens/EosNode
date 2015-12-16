/**
 * simple example of ripple observable
 */
var settings  = require('../settings'),
    Api       = require('../lib/eos/api'),
    colorUtil = require('../lib/eos/util/util.color.js'),
    Ripple  = require('../lib/eos/actions.rx/ripple.color.observable'),
    numLights = require('../lib/eos/light.color').defaults.numLights,
    palettes = require('../lib/eos/gradients');

var rippleSettings = {
    light: {
        color: 0xFFFF00
    }
};

var api      = Api(settings),
    // default
    ripple = Ripple(rippleSettings)
    // with a specific color
    //ripple = Ripple({color: 0xFF0000}) // red
    // with palette
    //ripple = Ripple({palette : palettes.crazyOrange })
    // fade
        //.scan(colorUtil.fadeColors({fastOn : true}), numLights);

//ripple.subscribe(function (val) {
//    console.log('val', val);
//});

ripple.subscribe(api.colors.set.bind(api));
