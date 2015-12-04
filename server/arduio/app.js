/**
 * creates a TCP server that reads Arduino Input button messages and transmits them on an UDP server
 */

var SerialPort = require("serialport").SerialPort,
    serialport = require("serialport"),
    // Load the TCP Library
    net = require('net'),
    colors = require('colors');

var ARDUIO_PORT = 5157;

// TODO: make this dynamic
var sp = new SerialPort("/dev/ttyUSB0", {
    baudrate: 19200,
    parser: serialport.parsers.readline("\n")
});

sp.on('open', function(){
    console.log('Serial Port Opened');
    sp.on('data', function(data){
        console.log(data.toString());
        broadcast(data.toString());
    });
});

// Send a message to all clients
function broadcast(message, sender) {
    clients.forEach(function (client) {
        // Don't want to send it to sender
        if (client === sender) return;
        client.write(message);
    });
    // Log it to the server output too
    console.log(message.blue);
}


// Keep track of the chat clients
var clients = [];

// Start a TCP Server
net.createServer(function (socket) {

    // create the serial port

    // Identify this client
    socket.name = socket.remoteAddress + ":" + socket.remotePort;

    // Put this new client in the list
    clients.push(socket);

    // Send a nice welcome message and announce
    socket.write("Welcome " + socket.name + "\n");
    broadcast(socket.name + " joined the chat\n", socket);

    // Handle incoming messages from clients.
    socket.on('data', function (data) {
        broadcast(socket.name + "> " + data, socket);
        // also send to serial port
        sp.write(data);
    });

    // Remove the client from the list when it leaves
    socket.on('end', function () {
        clients.splice(clients.indexOf(socket), 1);
        broadcast(socket.name + " left the chat.\n");
    });


}).listen(ARDUIO_PORT);

// Put a friendly message on the terminal of the server.
console.log("Broadcasting Arduio server at" , ARDUIO_PORT.green);