module.exports = {
  udp : {
    host : "192.168.0.102",
    udpPort : "5155",
    tcpPort : "5154"
  },

  touch: {
    host: "192.168.0.102",
    port: 5158
  },

  kinect: {
    host: "0.0.0.0",
    port: 7000
  },

  actions: {
  },

  emulator: {
    port: 7010,
    path: "./lib/eos/emulator/public/"
  },

  client: "udp"
}