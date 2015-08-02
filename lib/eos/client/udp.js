/**
 * EOS UDP Socket client
 *
 * implements the very low-level interface. The only options
 * you have are either sending an INIT message or an
 * ACTION message.
 *
 * INIT message
 * ---------------
 * Send two bytes, the server should return 'OK'
 * 0xFE 0xF0
 */
'use strict';

var dgram = require('dgram'),
    inherits = require('inherits'),
    EventEmitter = require('events').EventEmitter,
    _ = require('lodash');

// default host and port
var HOST = '192.168.3.51'; // TODO: make this dynamic
var PORT = 5155;

var MESSAGE_INIT = [0xFE, 0xF0];
var MESSAGE_ACTION = [0xFE, 0xF1];
var NUM_LIGHTS = 32;

var ERROR_START = 'MER';   //short for MESSAGE_ERROR
var ERROR_ACK = 0x01;    //the acknowledgement bytes are not valid
var ERROR_SEQ = 0x02;    // seq_number is not valid (has already been used?)
var ERROR_PWM = 0x03;    // PWM values are not valid
var ERROR_API = 0x04;    // when something goes wrong in calling the API
var ERROR_FORMAT = 0x05; // something wrong with unpacking the message

var MESSAGE_OK = 'MOK'; // the start of an OK message
var MESSAGE_ERROR = 'MER';
var INIT_OK = 'IOK';

module.exports = Client;

/**
 * eos client
 * @constructor
 */
function Client(host, port){
    this.host = host || HOST;
    this.port = port || PORT;

    // be sure to increment this number after every time you send a packet!
    this.seqNumber = 1;

    this.messageCallbacks = [];

    this.socket = new dgram.createSocket('udp4');

    this.socket.on('message', function (msg, remote) {
        //console.log('received message.length', msg.length);

        var message = parseMessage(msg);
        //console.log('message', message);
        // init message
        if(message.init){
            // execute the connect call back (if it exists)
            if(this.connectCb) this.connectCb();
            this.emit('connect');

        } else if(message.error){
            if(this.errorCb) this.errorCb(message.error);
            this.emit('error', message.error, message.seqNumber);
        } else if(message.ok){
            // TODO: use the messageCallbacks array
            if(this.okCb) this.okCb();
            this.emit('ok', message.seqNumber);
        }

    }.bind(this));
}

inherits(Client, EventEmitter);

Client.prototype.send = send;
Client.prototype.connect = connect;
Client.prototype.error = error;
Client.prototype.disconnect = disconnect;

function send(pwmValues){
    var seqEncoded = longToArray(this.seqNumber),
        pwmValuesEncoded = encodeList(pwmValues),
        message = new Buffer(MESSAGE_ACTION.concat(seqEncoded).concat(pwmValuesEncoded));

    //console.log('message to send', message);
    this.seqNumber += 1;

    this.socket.send(message, 0, message.length, this.port, this.host);
}

function connect(cb) {
    this.connectCb = cb;

    var initMessage = new Buffer(MESSAGE_INIT);

    this.socket.send(initMessage, 0, initMessage.length, this.port, this.host, function(err, bytes) {
        console.log('CONNECTED TO: ' + this.host + ':' + this.port);
        //console.log('bytes sent', bytes);

    }.bind(this));
}

function error(cb){
    this.errorCb = cb;
}

function disconnect() {
    this.socket.close();
}

function parseMessage(msg){

    var ret = {};

    if(msg.toString('ascii') === INIT_OK){
        // OK message!
        console.log('SERVER INIT OK');
        ret.init = true;
        ret.type = INIT_OK;
    }

    // ERROR MESSAGE
    if(msg.toString('ascii').substring(0,3) === ERROR_START){
        console.log('SERVER ERROR');
        // some error sending stuff!
        // get the sequence encoded number
        // TODO: make this take
        ret.seqNumber = arrayToLong(_(msg).drop(4).take(4).value());
        ret.type = MESSAGE_ERROR;
        ret.error = msg[3];
    }

    // OK message
    if(msg.toString('ascii').substring(0,3) === MESSAGE_OK){
        //console.log('SERVER OK');
        // message received successfully
        ret.type = MESSAGE_OK;
        ret.ok = true;
        ret.seqNumber = arrayToLong(_(msg).drop(3).take(4).value());
    }

    return ret;
}


/**
 * encode a list if values as a string
 * - Big Endian
 * @param list
 */
function encodeList(list){
    return _.reduce(list, function (memo, val) {
        // encode the value as a short (2 byte) big endian value
        return memo.concat([ val >> 8, val & 0xFF]);
    }, []);
}

/**
 * convert the number to a big endian long and return as an array
 * @param number
 */
function longToArray(number){
    return [number >> 24 & 0xFF, number >> 16 & 0xFF, number >> 8 & 0xFF, number & 0xFF];
}

function arrayToLong(arr){
    return (arr[0] << 24) + (arr[1] << 16) + (arr[2] << 8) + arr[3];
}
