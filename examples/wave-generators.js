/**
 * Created by rulkens on 13/12/15.
 */
var _         = require('lodash'),
    settings  = require('../settings'),
    Api       = require('../lib/eos/api'),
    colorUtil = require('../lib/eos/util/util.color.js'),
    rxUtil    = require('../lib/eos/util/util.rx');


var blockWave    = rxUtil.wave.block(),
    sawtoothWave = rxUtil.wave.sawtooth(),
    sineWave     = rxUtil.wave.sine({ waveLength: 1}),
    constantWave = rxUtil.wave.constant({value : .5}),
    triangleWave = rxUtil.wave.triangle();

//blockWave.map(toHashes).subscribe(console.log);
sawtoothWave.map(toHashes).subscribe(console.log);
//sineWave.map(toHashes).subscribe(console.log);
//sineWave.map(w => w.y).subscribe(console.log);
//constantWave.map(toHashes).subscribe(console.log);
//triangleWave.map(toHashes).subscribe(console.log);
//
function toHashes (wave) {
    return rxUtil.toHashes(wave.y);
}