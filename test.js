const { assert } = require('chai')
const Blockchain = require('./Blockchain')


describe("Blockchain", ()=>{
  let blockchain

  beforeEach(()=>{
    blockchain = new Blockchain()
  })

  it('Should it create a new Block when mining', ()=>{
    let previousHash = blockchain.getLastBlock().hash;
    let currentBlockData = {
      transactions: [
        {amount: 20,
        sender: "dewrt23412q",
        reciver: 'wsd5432frw'},

        {amount: 20,
          sender: "dewrt23412q",
          reciver: 'wsd5432frw'}
      ]
    }
    const nonce = blockchain.mineBlock(previousHash,currentBlockData)
    const lastBlockIndexNumber = blockchain.getLastBlock().index;

    assert.isNumber(nonce);
    assert.equal(lastBlockIndexNumber, 1);
  })

  it('should add a new transaction to the pending transactions', ()=>{
    const amount = 21
    const sender = 'awskiu1231kjh'
    const reciver = 'oi98cfdsr257'

    const newIndex = blockchain.addTransaction(amount,sender,reciver)

    assert.isNumber(newIndex);
    assert.equal(newIndex, 2);
    assert.equal((blockchain.pendingTransactions.length), 1);
    assert.deepEqual(blockchain.pendingTransactions[0], {
      amount:amount,
      sender:sender,
      reciver:reciver
    })
  })
})