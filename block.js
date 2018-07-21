// Class to represent a single block

// Using SHA 256 from crypto library
const  SHA256 = require('crypto-js/sha256')

class Block {
  constructor(timestamp, lastHash, hash, data) {

    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  toString() {
    return `Block -
      Timestamp: ${this.timestamp}
      LastHash : ${this.lastHash}
      Hash     : ${this.hash}
      Data     : ${this.data}`;
  }

  // The first block of a chain
  static genesis() {
    return new this('Genesis time', '-----', 'f1r57-h45h', [])
  }

  // The process of mining a block is to compute the hash of last block's hash plus the current blocks data
  static mineBlock(lastBlock, data) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = Block.hash(timestamp, lastHash, data);
    
    return new this(timestamp, lastHash, hash, data);
  }

  static hash(timestamp, lastHash, data) {
    return SHA256(`${timestamp}${lastHash}${data}`).toString();
  }

  // essentially a wrapper for the hash function, which takes a block itself instead of individual attributes
  static blockHash(block) {
    const { timestamp, lastHash, data } = block;
    return Block.hash(timestamp, lastHash, data);
  }
}

module.exports = Block;