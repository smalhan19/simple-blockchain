// Class to represent the actual block chain
const Block = require('./block');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  // Mine a new block and add to the chain
  addBlock(data) {
    const lastBlock = this.chain[this.chain.length-1];
    const block = Block.mineBlock(lastBlock, data);
    this.chain.push(block);

    return block;
  }

  // Validate the blocks to ensure no blocks has been tampered with
  isValidChain(chain) {
    if (JSON.stringify(chain[0]) != JSON.stringify(Block.genesis())) {
      return false;
    } 
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const lastBlock = chain[i-1];

      if(currentBlock.lastHash !== lastBlock.hash || 
        currentBlock.hash !== Block.blockHash(currentBlock)) {
        return false;
      }

      return true;
    }
  }

  // Add new incoming blocks if they're part of a valid chain, and is longer than the current chain
  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log('Received chain is not longer than current');
      return;
    } else if (!this.isValidChain(newChain)) {
      console.log('Received chain is not valid');
    } else {
      console.log('Replacing block chain with new incoming chain');
      this.chain = newChain;
    }
  }
}

module.exports = Blockchain;