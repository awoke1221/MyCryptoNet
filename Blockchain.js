
const sha256 = require('sha256')
const currentNodeUrl = process.argv[3]

// creating blockchain network with class based code staructure and javascript programing languages
class Blockchain{
    constructor(){
        this.chain = []
        this.pendingTransactions = []
        this.currentNodeUrl = currentNodeUrl
        this.networkNodes =[]
        this.createNewBlock(1,'0',"0")
                
    }
  

    createNewBlock(nonce,previousHash,hash){
        const newBlock = {
            index:this.chain.length +1,
            timeStamp: Date.now(),
            nonce: nonce,
            previousHash: previousHash,
            hash: hash,
            Transactions: this.pendingTransactions
        }
               
        this.pendingTransactions =[]  
        this.chain.push(newBlock)
        return newBlock           

    }

    getLastBlock(){
        return this.chain[this.chain.length -1]

    }

    addTransaction(amount, sender, receiver){
        if(!amount || amount <=0){
            throw new Error ("Invalid Transaction Ammount ")
        }

        const newTransaction = {
            amount: amount,
            sender: sender,
            receiver: receiver
        }
        this.pendingTransactions.push(newTransaction)
        return this.getLastBlock().index +1

    }

    hashBlock(previousHash,currentBlockData,nonce){
        const dataAsString = previousHash + nonce.toString() + JSON.stringify(currentBlockData)
        const hash = sha256(dataAsString).toString()

        return hash

    }

    mineBlock(previousHash,currentBlockData){
        let nonce = 0
        let hash = this.hashBlock(previousHash,currentBlockData,nonce)
        while(hash.substring(0, 3) !== '000'){
            nonce +=1
            hash = this.hashBlock(previousHash,currentBlockData,nonce)
        }
        return nonce
    }

   

    registerNode(nodeurl){
        this.networkNodes.push(nodeurl)
    }

}

module.exports= Blockchain