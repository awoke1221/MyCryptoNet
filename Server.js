// importing important modules
const express = require('express')
const bodyParser = require('body-parser')
const Blockchain = require('./Blockchain')
const crypto = require('crypto')
const uuid = crypto.randomUUID()
const nodeaddress = uuid.split('-').join('')

// creating a server 
const app = express()
const port = process.argv[2]

// creating a new instance of the blockchain 
const blockchain = new Blockchain()
app.use(bodyParser.json())


// get the intair blockchain
app.get('/blockchain', (req,res)=>{
    res.send(blockchain)
})

// Add a new transactin to the pending transactions
app.post('/transaction', (req,res) => {
    const {amount, sender,receiver} = req.body;
    const newIndex = blockchain.addTransaction(amount,sender,receiver);
    res.json({
        message: " Transaction added secussfully ",
        index: newIndex
    })

})


app.get('/mine', (req,res) => {
    const lastBlock = blockchain.getLastBlock();
    const previousHash = lastBlock['hash']
   
    const currentBlockData = {
        transactions: blockchain.pendingTransactions,
        index: lastBlock['index'] +1
    }
     
    const nonce = blockchain.mineBlock(previousHash,currentBlockData)
    const hash = blockchain.hashBlock(previousHash,currentBlockData,nonce)

    const newBlock = blockchain.createNewBlock(nonce,previousHash,hash)

    blockchain.addTransaction(12, "00", nodeaddress)

    res.send({
        message: " the block is mined",
        newBlock: newBlock        
    })
  })

// register and brodcast the node
app.post("/register-and-brodcast-node", (req,res)=>{
    const newNodeUrl = req.body.newNodeUrl

})
  

app.post('/register-node', (req,res) => {
    const newNodeUrl = req.body.nodeurl
    if (blockchain.networkNodes.includes(newNodeUrl)) {
        res.send('Node already exists in the network.');
    } else {
        blockchain.registerNode(newNodeUrl);
        res.send('New node registered successfully.');
    }
})

app.post('/register-nodes-bulk', (req,res)=>{

})

// starting the server 
app.listen(port, ()=>{
    console.log(`blockchain runs on the ${port}`)
})