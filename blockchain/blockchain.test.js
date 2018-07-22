// Unit tests for the Blockchain class

const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', () => {
  let bc, bc2;

  beforeEach(() => {
    bc = new Blockchain();
    bc2 = new Blockchain();
  });

  it('Blockchain starts with genesis block', () => {
    expect(bc.chain[0]).toEqual(Block.genesis());
  });

  it('Blockchain adds a new block', () => {
    const data = 'foo';
    bc.addBlock(data);
    expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
  });

  it('Validates a valid chain', () => {
    const data = 'foo';
    bc2.addBlock(data);
    expect(bc.isValidChain(bc2.chain)).toBe(true);
  });

  it('Invalidates chain with corrupt genesis block', () => {
    bc2.chain[0].data = 'corrupt';
    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  it('Invalidates a corrupt chain, bad data', () => {
    const data = 'foo';
    bc2.addBlock(data);
    bc2.chain[1].data = 'bar'
    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  it('Invalidates a corrupt chain, bad timestamp', () => {
    const data = 'foo';
    bc2.addBlock(data);
    bc2.chain[1].timestamp = Date.now() + 5;
    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  it('Chain is replaced if given a valid new chain', () => {
    const data = 'foo';
    bc2.addBlock(data);
    bc.replaceChain(bc2.chain);
    expect(bc.chain).toEqual(bc2.chain);
  });

  it('Chain is not replaced if given chain is not valid', () => {
    const data = 'foo';
    bc2.addBlock(data);
    bc2.chain[1].data = 'corrupt';
    bc.replaceChain(bc2.chain);
    expect(bc.chain).not.toEqual(bc2.chain);
  });

  it('Chain is not replaced if given chain is smaller than current', () => {
    const data = 'foo';
    bc.addBlock(data);
    bc.replaceChain(bc2.chain);
    expect(bc.chain).not.toEqual(bc2.chain);
  });
});

