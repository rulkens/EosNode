/**
 * EOS UDP Socket client
 *
 * implements the very low-level UDP interface with the Python UDP server running on the
 * raspberry pi
 *
 *
 * Control the Halogen lights with the MESSAGE_HALOGEN and 32 16-bit ints representing the values
 * between 0-4095
 *
 * Control the LED lights with the MESSAGE_LED and 120 byte triples (r, g, b)
 *
 *
 *
 * INIT message
 * ---------------
 * Send two bytes, the server should return 'OK'
 * 0xFE 0xF0
 *
 * ACTION message
 * ---------------
 * Send two ack bytes, then two bytes for every light
 */
'use strict';

var dgram        = require('dgram'),
    inherits     = require('inherits'),
    EventEmitter = require('events').EventEmitter,
    _            = require('lodash');

// default host and port
var HOST = '127.0.0.1',//HOST = '192.168.3.51', // TODO: make this dynamic
    PORT = 5155;

var MESSAGE_INIT    = [0xFE, 0xF0],
    MESSAGE_HALOGEN = [0xFE, 0xF1],
    MESSAGE_LED     = [0xFE, 0xF2],
    MESSAGE_PANIC   = [0xFE, 0xFF],
    NUM_LIGHTS      = 32;

var ERROR_START     = 'MER',    //short for MESSAGE_ERROR
    ERROR_ACK       = 0x01,     //the acknowledgement bytes are not valid
    ERROR_SEQ       = 0x02,     // seq_number is not valid (has already been used?)
    ERROR_PWM       = 0x03,     // PWM values are not valid
    ERROR_H_API     = 0x04,     // when something goes wrong in calling the halogen API
    ERROR_H_FORMAT  = 0x05,     // something wrong with unpacking the message

    ERROR_L_API     = 0x06,     // when something goes wrong in calling the LED API
    ERROR_L_FORMAT  = 0x07;     // something wrong with unpacking the message

var MESSAGE_OK    = 'MOK', // the start of an OK message
    MESSAGE_ERROR = 'MER',
    INIT_OK       = 'IOK';

module.exports = Client;

inherits(Client, EventEmitter);

Client.prototype.send        = send;
Client.prototype.sendLed     = sendLed;
Client.prototype.connect     = connect;
Client.prototype.error       = error;
Client.prototype.disconnect  = disconnect;
Client.prototype.panic       = sendPanic;
Client.prototype.sendMessage = sendMessage;

/**
 * EOS UDP client
 *
 * @param settings
 * @constructor
 */
function Client(settings){

    console.log('settings', settings);
    this.settings = settings || {};
    this.host = this.settings.host || HOST;
    this.port = this.settings.port || PORT;

    // be sure to increment this number after every time you send a packet!
    this.seqNumber = 1;

    this.messageCallbacks = [];

    this.socket = new dgram.createSocket('udp4');

    this.socket.on('message', function (msg, remote) {

        var message = parseMessage(msg);
        //console.log('message', message);
        // init message
        if(message.init){
            //console.log('message.init', message);
            this.connected = true;
            // execute the connect call back (if it exists)
            if(this.connectCb) this.connectCb();
            this.emit('connect');
        } else if(message.error){
            console.log('message.error', message);
            if(this.errorCb) this.errorCb(message.error);
            this.emit('error', message.error, message.seqNumber);
        } else if(message.ok){
            // TODO: use the messageCallbacks array
            if(this.okCb) this.okCb();
            this.emit('ok', message.seqNumber);
        }

    }.bind(this));
}

/**
 * send a list of PWM values (12 bit) to the server
 *
 * @param pwmValues
 */
function send(pwmValues){
    var seqEncoded = longToArray(this.seqNumber),
        pwmValuesEncoded = encodeList(pwmValues),
        message = new Buffer(MESSAGE_HALOGEN.concat(seqEncoded).concat(pwmValuesEncoded));

    //console.log('message to send', message);
    this.seqNumber += 1;

    this.sendMessage(message);
}

/**
 * send a list of color values to the server (0x0 to 0xFFFFFF), 32-bit longs (first 8 bits not used)
 * @param colorValues
 */
function sendLed(colorValues){
    var seqEncoded = longToArray(this.seqNumber),
        startSeq = MESSAGE_LED.concat(seqEncoded),
        message = new Buffer(startSeq.length + (colorValues.length * 4));

    startSeq.forEach(function (val, index) {
        message.writeUInt8(val, index);
    });
    // add the color values to the buffer
    colorValues.forEach(function (val, index) {
        message.writeUInt32BE(val, (index*4) + startSeq.length);
    });
    //console.log('colorValues', colorValues);
    this.seqNumber += 1;

    this.sendMessage(message);
}

/**
 * send the actual message to the socket
 * @todo: perhaps do some error checking here? Also check if the client is actually connected. If not, connect it
 * @param message
 */
function sendMessage (message){
    var that = this;

    if(!this.connected){
        this.connect(function (){
            that.socket.send(message, 0, message.length, that.port, that.host);
        })
    } else {
        this.socket.send(message, 0, message.length, this.port, this.host);
    }
}

/**
 * send a panic message, telling the server to turn all halogen and led lights off
 */
function sendPanic(){
    var seqEncoded = longToArray(this.seqNumber),
        message = new Buffer(MESSAGE_PANIC);

    this.seqNumber += 1;

    this.socket.send(message, 0, message.length, this.port, this.host);
}

/**
 * connect to the UDP socket and send the MESSAGE_INIT, checking if we have a proper connection
 * @param cb
 */
function connect(cb) {
    this.connectCb = cb;

    var initMessage = new Buffer(MESSAGE_INIT);

    this.socket.send(initMessage, 0, initMessage.length, this.port, this.host, function(err, bytes) {
        console.log('CONNECT INFO SENT TO: ' + this.host + ':' + this.port);
        //console.log('bytes sent', bytes);

    }.bind(this));
}

function error(cb){
    this.errorCb = cb;
}

function disconnect() {
    this.connected = false;
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
