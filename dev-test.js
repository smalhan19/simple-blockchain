// Can edit this file for some quick live tests through nodemon

const Blockchain = require('./blockchain/blockchain');
const bc = new Blockchain();

for (let i = 0; i < 10; i++) {
  console.log(bc.addBlock(`foo ${i}`).toString());
}