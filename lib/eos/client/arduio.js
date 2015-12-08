/**
 * Arduio Client
 * @type {Client}
 */
var net          = require('net'),
    inherits     = require('inherits'),
    EventEmitter = require('events').EventEmitter;

module.exports = Client;

// TODO: load this from settings or ENV variable?
Client.DEFAULT_PORT = 5157;

inherits(Client, EventEmitter);

var net = require('net');

function Client (PORT){
    var client = new net.Socket();
    client.connect(PORT, '127.0.0.1', function() {
        console.log('Connected');
        client.write('setState 1');
        this.emit('connect');
    });

    client.on('data', function(data) {
        console.log('Received: ' + data);
        //
        this.emit('data', data);
    });

    client.on('close', function() {
        console.log('Connection closed');
        this.emit('close');
    });
}
