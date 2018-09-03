// Class to represent a single block

// Using SHA 256 from crypto library
const  SHA256 = require('crypto-js/sha256');

// Pull the difficulty value from config
const { DIFFICULTY, MINE_RATE } = require('../config');

class Block {
  constructor(timestamp, lastHash, hash, data, nonce, difficulty) {

    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString() {
    return `Block -
      Timestamp : ${this.timestamp}
      LastHash  : ${this.lastHash}
      Hash      : ${this.hash}
      Nonce     : ${this.nonce}
      Difficulty: ${this.difficulty}
      Data      : ${this.data}`;
  }

  // The first block of a chain
  static genesis() {
    return new this('Genesis time', '-----', 'f1r57-h45h', [], 0, DIFFICULTY);
  }

  // The process of mining a block is to compute the hash of last block's hash plus the current blocks data
  static mineBlock(lastBlock, data) {
    const lastHash = lastBlock.hash;

    // Proof of work algorthim - keep hashing until we have a specified number of zeros
    let nonce = 0;
    let {difficulty} = lastBlock;
    let hash, timestamp;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0,difficulty) != '0'.repeat(difficulty));
    
    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
  }

  // essentially a wrapper for the hash function, which takes a block itself instead of individual attributes
  static blockHash(block) {
    const { timestamp, lastHash, data, nonce, difficulty } = block;
    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }

  // Method to dynamically adjust mining difficulty
  static adjustDifficulty(lastBlock, currentTime) {
    let {difficulty} = lastBlock;
    difficulty = (lastBlock.timestamp + MINE_RATE > currentTime) ? difficulty + 1 : difficulty - 1;
    return difficulty;
  } 
}

module.exports = Block;