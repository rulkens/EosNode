/**
 * simple example of gradient observable
 */
var _            = require('lodash'),
    Rx           = require('rx'),
    settings     = require('../settings'),
    Api          = require('../lib/eos/api'),
    colorUtil    = require('../lib/eos/util/util.color.js'),
    Gradient$    = require('../lib/eos/actions.rx/gradient.observable'),
    numLights    = require('../lib/eos/light.color').defaults.numLights,
    gradientList = require('../lib/eos/gradients');

var api = Api(settings);

const TIME_PER_GRADIENT = 5; // in seconds

var gradients  = _.map(gradientList, function (g, i) {
        return {g : g, name : i}
    }),
    gradients$ = Rx.Observable.fromArray(gradients),
    interval   = Rx.Observable.interval(TIME_PER_GRADIENT * 1000).startWith(0); // .take(gradients.length);

gradientsInTime$ = Rx.Observable
	.zip(gradients$, interval, function (a, b) {
		return a
	})
	.do(function (g) {
		console.log('playing', g.name)
	})
	.map(function (g) {
		return g.g
	})
	.flatMapLatest(function (g) {
		return Gradient$({
			gradient   : g,
			waveLength : Math.random() * 5 + 5,
			direction  : Math.random() > .5 ? 'up' : 'down'
		})
	})
	// nice fade
	.scan(colorUtil.fadeColors({ratio : 0.96}), numLights);

gradientsInTime$.subscribe(toApi);

function toApi (light) {
	//console.log('light', light);
	api.colors.set(light);
}
