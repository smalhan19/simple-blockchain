// Class to represent our P2P server for managing multiple peers on blockchain network
const Websocket = require('ws');

// Allow user to specify a different port
const P2P_PORT = process.env.P2P_PORT || 5001;

// Maintain a list of all peers on the network
const PEERS = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  // Startup new websocket server
  listen() {
    const server = new Websocket.Server({port : P2P_PORT});
    server.on('connection', socket => this.connectSocket(socket));

    this.connectToPeers();

    console.log(`Listening for P2P connections on ${P2P_PORT}`);
  }

  // Open websocket connection to each peer
  connectToPeers() {
    PEERS.forEach(peer => {
      const socket = new Websocket(peer);
      socket.on('open', () => this.connectSocket(socket));
    });
  }
  
  // Routine for when we connect to a new peer
  connectSocket(socket) {
    this.sockets.push(socket);
    console.log('Socket connected');

    this.messageHandler(socket);

    // send over copy of blockchain to newly connected peer
    this.sendChain(socket);
  }

  // Handler for messages being sent by peers
  messageHandler(socket) {
    socket.on('message', message => {
      const data = JSON.parse(message);

      // attempt to replace my current blockchain with received chain
      this.blockchain.replaceChain(data);
    });
  }

  // Sync my blockchain with all connected peers
  synchronizeChains() {
    this.sockets.forEach(socket => this.sendChain(socket));
  }

  // Method to send blockchain to a given socket
  sendChain(socket) {
    socket.send(JSON.stringify(this.blockchain.chain));
  }
}

module.exports = P2pServer;