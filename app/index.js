// Simple webservice for interacting with blockchain
const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain/blockchain');

// allow user to specify port, or use 3001 by default
const HTTP_PORT = process.env.HTTP || 3001;

const app = express();
const bc = new Blockchain();

app.use(bodyParser.json());

// API to display current blocks in the chain
app.get('/blocks', (req, res) => {
  res.json(bc.chain);
});

// API to add a block to the chain
app.post('/mine', (req,res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);
  
  res.redirect('/blocks');
});

// Start the application
app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
