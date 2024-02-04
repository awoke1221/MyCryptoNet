// importing important modules
const express = require('express')
const bodyParser = require('body-parser')
const Blockchain = require('./Blockchain')
const crypto = require('crypto')
const uuid = crypto.randomUUID()
const nodeaddress = uuid.split('-').join('')
const rqp = require("request-promise")
const { promises } = require('dns')


// creating a server 
const app = express()
const port = process.argv[2]

// creating a new instance of the blockchain 
const blockchain = new Blockchain()
app.use(bodyParser.json())


// get the intair blockchain network
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

// mine the blockchain and it is a post method
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
    if (blockchain.networkNodes.indexOf(newNodeUrl)==-1) blockchain.networkNodes.push(newNodeUrl)
    
    const regNodePromise = []
    blockchain.networkNodes.forEach(networkNodeURL =>{
        const requestOptions = {
            uri: networkNodeURL + "/register-node",
            method: "POST",
            body:{newNodeUrl: newNodeUrl},
            json: true
        }
        regNodePromise.push(rqp(requestOptions))

    })
    Promise.all(regNodePromise)
    .then(data =>{
        const bulkRegisterOption ={
            uri: newNodeUrl + "/register-nodes-bulk",
            method: "POST",
            body:{allNetworkNodes: [...blockchain.networkNodes, blockchain.currentNodeUrl]},
            json: true
        }

        return rqp(bulkRegisterOption)

    })
    .then(data=>{
        res.json({note: 'new node is register to the network sucessfully'})

    })

})

// registaer a new node to the network
app.post('/register-node', (req,res) => {
    const newNodeUrl = req.body.nodeurl
    if (blockchain.networkNodes.includes(newNodeUrl)) {
        res.send('Node already exists in the network.');
    } else {
        blockchain.registerNode(newNodeUrl);
        res.send('New node registered successfully.');
    }
})

// registaer nodes in a bulk
app.post('/register-nodes-bulk', (req,res)=>{
    const allNetworkNodes = req.body.allNetworkNodes
    allNetworkNodes.forEach(networkNodeURL =>{
        const nodeNotAlredyPresent = blockchain.networkNodes.indexOf(networkNodeURL)== -1
        const noteCurrentNode = blockchain.currentNodeUrl !== networkNodeURL

        if (nodeNotAlredyPresent && noteCurrentNode) {
            blockchain.networkNodes.push(networkNodeURL)
            
        }
    })
    res.json({note: "Bulk registration secussfully..."})

})

// starting the server 
app.listen(port, ()=>{
    console.log(`blockchain runs on the ${port}`)
})