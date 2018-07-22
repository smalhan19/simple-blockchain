// Unit tests for the Block class

const Block = require('./block');

describe('Block', () => {
  let data, block, lastBlock;

  beforeEach(() => {
    data = "bar";
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });

  it('sets the data to match given input', () => {
    expect(block.data).toEqual(data);
  });

  it('sets the lasthash to match hash of last block ', () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });
});

