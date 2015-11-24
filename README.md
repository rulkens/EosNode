# EosNode

Controlling the Eos lamp via a python UDP server. Take a look at [the server code](https://github.com/rulkens/EosPython).

## Installation

Run `npm install`.

For the frontend to build you need gulp.

    npm install gulp -g
    
## Running

You can run the default blink program with

    node ./index.js
    
If you want to run one or more of the actions (in the lib/eos/actions folder) you can use the command line utility provided. To run the `blink` program:

    ./eos blink
    
Eos also has Leap Motion support. To run the leap motion color program:

    ./eos leap-motion.color
    
Both a halogen and a led clock are included

    ./eos analogue-clock
    ./eos analogue-clock.color
    
## Dependencies and configuration

EosNode uses a custom python UDP server that needs to be running on port 5154 (this will be changeable in the future). You can change
the IP address and the port in the `settings.json` file in the root folder.
