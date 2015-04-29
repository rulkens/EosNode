var Eos = require('./lib/eos/client/eos'),
    defaultProgram = require('./lib/eos/default-program');

eos = new Eos();

eos.on('connect', function () {
    defaultProgram(eos);
});

process.on('SIGINT', function(){
    console.log('Turning off all lights');
    eos.api('off');
    process.exit();
});
