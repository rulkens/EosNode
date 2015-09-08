/**
 * TCP socket client
 */
'use strict';

var net          = require('net'),
    inherits     = require('inherits'),
    EventEmitter = require('events').EventEmitter,
    q            = require('q');

// default host and port
var HOST = '127.0.0.1',
    PORT = 5154;

/**
 * eos client
 * @constructor
 */
var Client = function(host, port){
    this.host = host || HOST;
    this.port = port || PORT;

    this.socket = new net.Socket();

    this.socket.connect(this.port, this.host, function() {
        console.log('CONNECTED TO: ' + this.host + ':' + this.port);
        this.emit('connect');
    }.bind(this));

    // Add a 'data' event handler for the client socket
    // data is what the server sent to this socket
    this.socket.on('data', function(data) {
        this.emit('data', JSON.parse(data));
    }.bind(this));

    // Add a 'close' event handler for the client socket
    this.socket.on('close', function() {
        this.emit('close');
    }.bind(this));
};

inherits(Client, EventEmitter);

Client.prototype.api = function(action, args){
    this.socket.write(JSON.stringify({ 'action': action, 'arguments' : args || []}) + "\n");
    // TODO: return a promise

};

module.exports = Client;
