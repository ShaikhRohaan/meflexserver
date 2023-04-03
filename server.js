
const express = require('express');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');
const { query } = require('express');
const {ethers,JsonRpcProvider , formatEther, parseUnits, isAddress} = require("ethers");
require('dotenv').config();

const bip39 = require('bip39');
const pkutils = require('ethereum-mnemonic-privatekey-utils');
const Web3 = require('web3');
const hdkey = require('hdkey');

const JWT_SECRETKEY = (process.env.REACT_APP_SECRET_KEY) 
const JWT_PASSWORDKEY = (process.env.REACT_APP_PASSWORD_KEY)
var app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// console.log(JWT_SECRETKEY);

// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'wallet_data'
// });

// connection.connect();
// console.log("Connect");




//////////////Create account & menomic //////////
app.get('/memonic',async function (req,res) {
  const web3 = new Web3();
  
  const memonic = bip39.generateMnemonic();

  const privateKey = pkutils.getPrivateKeyFromMnemonic(memonic);

  const address = web3.eth.accounts.privateKeyToAccount(privateKey).address;
  const token = await jwt.sign(
    {
    privateKey: privateKey
    },
    JWT_SECRETKEY
  )
  const data = {
    phrase: memonic,
    privateKey : token,
    address : address,
  }
  console.log(data);
  return res.status(200).send(data)
});
//////////////Create account & menomic //////////

//////////////Create other accounts //////////
app.get('/createnew1',async function (req,res){
  const web3 = new Web3('https://eth-goerli.g.alchemy.com/v2/d3XAlD6RgOfYQmBcWd59GVxLYki-b9bQ');
  var accCreate = web3.eth.accounts.create()
  // console.log(accCreate);
  const token = await jwt.sign(
    {
    privateKey: accCreate.privateKey
    },
    JWT_SECRETKEY
  )
  const data = {
    privateKey: token,
    address : accCreate.address,
   }
   console.log(data);
  
   return res.status(200).send(data)
})  
//////////////Create other accounts //////////


//////////////Import Token //////////
app.get('/imptoken',async function (req,res){
  const rpc = req.query.rpc
  const wallet_address = req.query.wallet
  const token_address = req.query.token
  const abi = [
    {
      "inputs": [],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_choice",
          "type": "uint256"
        }
      ],
      "name": "changeCoinPrice",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "_choice",
          "type": "bool"
        }
      ],
      "name": "isTransferable",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amountsend",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "current_balance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tokenPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "transferable",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "users",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "usersAllowedCoins",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "wallet",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  console.log(rpc);
  console.log(wallet_address);
  console.log(token_address);

  const web3 = await new Web3(new Web3.providers.HttpProvider(rpc));
  const token = await new web3.eth.Contract(abi, token_address);
  try{
  token.methods.balanceOf(wallet_address).call((error, balance) => {
    if (error) {
      console.error(error);
      return res.status(200).send(error)
    } else {
      console.log(`The balance of account ${wallet_address} for the token at address ${token_address} is ${balance}`)
      console.log(balance);
  const value = web3.utils.fromWei(balance, 'ether');
  token.methods.symbol().call((error, symbol) => {
        if (error) {
          console.error(error);
        } else {
          console.log(symbol);
          const data = {balance : value , token_address : token_address , wallet_address : wallet_address , symbol : symbol , rpc : rpc};
          console.log(data);
          return res.status(200).send(data)
        }
      });

     
    }
  })
}catch(error){
};

})  
//////////////Import Token //////////
 

//////////////import account using menomic //////////
app.get('/machimp',async function (req,res){
const web3 = new Web3('https://eth-goerli.g.alchemy.com/v2/d3XAlD6RgOfYQmBcWd59GVxLYki-b9bQ');
var a =  req.query.input
console.log(a);

const mnemonic = a;
const seed = bip39.mnemonicToSeedSync(mnemonic);
const root = hdkey.fromMasterSeed(seed);
const privateKey = root.derive("m/44'/60'/0'/0/0")._privateKey.toString('hex');

const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

const balance = await web3.eth.getBalance(account.address);
const token = await jwt.sign(
  {
  privateKey: privateKey
  },
  JWT_SECRETKEY
)
const data = {
  privateKey: token,
  address : account,
  balance : balance,
 }
 console.log(data);

 return res.status(200).send(data)
  // res.setHeader('Content-Type', 'application/json');
  
  //   connection.query(`SELECT * FROM wallet_id where phrase = '${a}' `, function (err, result) {
  //   if (err) throw err;
  //   res.send(result);
  // });
})  
//////////////import account using menomic //////////


//////////////import account using Privet Key //////////
app.get('/keyimport',async function (req,res){
  const web3 = new Web3();
  var message =  req.query.key
  var acc = web3.eth.accounts.wallet.add(message);
  var a = web3.eth.accounts.wallet.add(acc);
  console.log(a);

  const token = await jwt.sign(
    {
    privateKey: a.privateKey
    },
    JWT_SECRETKEY
  )
  const data = {
    privateKey: token,
    address : a.address,
   }
   console.log(data);
  
   return res.status(200).send(data)
})  
//////////////import account using Privet key //////////


////////////open secret key //////////
app.get('/decrypt',async function (req,res){
var a =  req.query.input
console.log(a);
const token = await jwt.verify(
   a , JWT_SECRETKEY
)
const data = {
  privateKey: token,
 }
 console.log(data);
 return res.status(200).send(data)
}) 
/////////////open secret key //////////


////////////open password key //////////
app.get('/pwdecrypt',async function (req,res){
  var a =  req.query.pwd
  console.log(a);
  const token = await jwt.verify(
     a , JWT_PASSWORDKEY
  )
  const data = {
    password: token,
   }
   console.log(data);
   return res.status(200).send(data)
}) 
  /////////////open password key //////////


////////////wallet password  encrypt//////////
app.get('/password',async function (req,res){
  var password = req.query.pwd
  const token = await jwt.sign(
    {
    password : password
    },
    JWT_PASSWORDKEY
  )
  const data = {
    password : token
   }
   console.log(data);
   return res.status(200).send(data)
})  
////////////wallet password //////////

/////////////transfer //////////
app.get('/transfer',async function (req,res){
// const web3 = new Web3('https://eth-goerli.g.alchemy.com/v2/d3XAlD6RgOfYQmBcWd59GVxLYki-b9bQ');
var key = req.query.key
var from = req.query.from
var to = req.query.to
var amount = req.query.val
var rpc = req.query.rpc
const web3 = new Web3(rpc);




const token = await jwt.verify(
  key , JWT_SECRETKEY
)
const pkey = {
 privateKey: token,
}
var PRIVATE_KEY = pkey.privateKey.privateKey
 console.log(PRIVATE_KEY);
console.log(rpc)


 var receiptAddress = from
  console.log("wallet address "+receiptAddress)
  // var amount = req.body.token
  // console.log("amount "+amount)
  const accountSender = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
  const receiverAddress = to;

// Set up the amount of BNB to transfer (in wei)
const amountWei = web3.utils.toWei(amount, 'ether');

// Build the transaction object
const transactionObject = {
  from: accountSender.address,
  to: receiverAddress,
  value: amountWei,
  gas: 31000,
};

// Sign and send the transaction
try{
web3.eth.accounts.signTransaction(transactionObject, PRIVATE_KEY)
  .then(signedTx => {
    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    .on('transactionHash', (hash) => {
      console.log('Transaction hash:', hash);
      // res.send(hash);
      let data = {
        hash: hash
      }
      return res.status(200).send(data);
    })
    .on('receipt', (receipt) => {
      let data = {
        hash: 1
      }
      console.log('Transaction receipt:', receipt);
      return res.status(200).send(data);
    })
    .on('error', (error) => {
      let data = {
        hash: 1
      }
      console.error('Transaction error:', error.message);
      return res.status(200).send(data);
    });
  });
}
  catch(err){
    //res.send(err.error.message);
  }
//   var privateKey = PRIVATE_KEY 
//   privateKey = "0x".concat(privateKey)
//   console.log("privateKey "+privateKey)
//   console.log(rpc)
//   const abi = [
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "name",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "string"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "_upgradedAddress",
//                 "type": "address"
//             }
//         ],
//         "name": "deprecate",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "_spender",
//                 "type": "address"
//             },
//             {
//                 "name": "_value",
//                 "type": "uint256"
//             }
//         ],
//         "name": "approve",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "deprecated",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "bool"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "_evilUser",
//                 "type": "address"
//             }
//         ],
//         "name": "addBlackList",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "totalSupply",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "_from",
//                 "type": "address"
//             },
//             {
//                 "name": "_to",
//                 "type": "address"
//             },
//             {
//                 "name": "_value",
//                 "type": "uint256"
//             }
//         ],
//         "name": "transferFrom",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "upgradedAddress",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "address"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [
//             {
//                 "name": "",
//                 "type": "address"
//             }
//         ],
//         "name": "balances",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "decimals",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "maximumFee",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "_totalSupply",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [],
//         "name": "unpause",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [
//             {
//                 "name": "_maker",
//                 "type": "address"
//             }
//         ],
//         "name": "getBlackListStatus",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "bool"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [
//             {
//                 "name": "",
//                 "type": "address"
//             },
//             {
//                 "name": "",
//                 "type": "address"
//             }
//         ],
//         "name": "allowed",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "paused",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "bool"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [
//             {
//                 "name": "who",
//                 "type": "address"
//             }
//         ],
//         "name": "balanceOf",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [],
//         "name": "pause",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "getOwner",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "address"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "owner",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "address"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "symbol",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "string"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "_to",
//                 "type": "address"
//             },
//             {
//                 "name": "_value",
//                 "type": "uint256"
//             }
//         ],
//         "name": "transfer",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "newBasisPoints",
//                 "type": "uint256"
//             },
//             {
//                 "name": "newMaxFee",
//                 "type": "uint256"
//             }
//         ],
//         "name": "setParams",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "amount",
//                 "type": "uint256"
//             }
//         ],
//         "name": "issue",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "amount",
//                 "type": "uint256"
//             }
//         ],
//         "name": "redeem",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [
//             {
//                 "name": "_owner",
//                 "type": "address"
//             },
//             {
//                 "name": "_spender",
//                 "type": "address"
//             }
//         ],
//         "name": "allowance",
//         "outputs": [
//             {
//                 "name": "remaining",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "basisPointsRate",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [
//             {
//                 "name": "",
//                 "type": "address"
//             }
//         ],
//         "name": "isBlackListed",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "bool"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "_clearedUser",
//                 "type": "address"
//             }
//         ],
//         "name": "removeBlackList",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "MAX_UINT",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "newOwner",
//                 "type": "address"
//             }
//         ],
//         "name": "transferOwnership",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "_blackListedUser",
//                 "type": "address"
//             }
//         ],
//         "name": "destroyBlackFunds",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "inputs": [
//             {
//                 "name": "_initialSupply",
//                 "type": "uint256"
//             },
//             {
//                 "name": "_name",
//                 "type": "string"
//             },
//             {
//                 "name": "_symbol",
//                 "type": "string"
//             },
//             {
//                 "name": "_decimals",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "constructor"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": false,
//                 "name": "amount",
//                 "type": "uint256"
//             }
//         ],
//         "name": "Issue",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": false,
//                 "name": "amount",
//                 "type": "uint256"
//             }
//         ],
//         "name": "Redeem",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": false,
//                 "name": "newAddress",
//                 "type": "address"
//             }
//         ],
//         "name": "Deprecate",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": false,
//                 "name": "feeBasisPoints",
//                 "type": "uint256"
//             },
//             {
//                 "indexed": false,
//                 "name": "maxFee",
//                 "type": "uint256"
//             }
//         ],
//         "name": "Params",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": false,
//                 "name": "_blackListedUser",
//                 "type": "address"
//             },
//             {
//                 "indexed": false,
//                 "name": "_balance",
//                 "type": "uint256"
//             }
//         ],
//         "name": "DestroyedBlackFunds",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": false,
//                 "name": "_user",
//                 "type": "address"
//             }
//         ],
//         "name": "AddedBlackList",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": false,
//                 "name": "_user",
//                 "type": "address"
//             }
//         ],
//         "name": "RemovedBlackList",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": true,
//                 "name": "owner",
//                 "type": "address"
//             },
//             {
//                 "indexed": true,
//                 "name": "spender",
//                 "type": "address"
//             },
//             {
//                 "indexed": false,
//                 "name": "value",
//                 "type": "uint256"
//             }
//         ],
//         "name": "Approval",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": true,
//                 "name": "from",
//                 "type": "address"
//             },
//             {
//                 "indexed": true,
//                 "name": "to",
//                 "type": "address"
//             },
//             {
//                 "indexed": false,
//                 "name": "value",
//                 "type": "uint256"
//             }
//         ],
//         "name": "Transfer",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [],
//         "name": "Pause",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [],
//         "name": "Unpause",
//         "type": "event"
//     }
//               ];

// // const provider = new JsonRpcProvider("https://bsc-dataseed.binance.org/"); // Connect to Ropsten testnet
// const provider = new JsonRpcProvider(rpc);
// const wallet = new ethers.Wallet(privateKey, provider);
// const amountConvert = parseUnits(amount,18)
// const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
// if(isAddress(receiptAddress)){
//   try{
// const tx = await contract.transfer(receiptAddress, amountConvert);
// console.log('Transaction hash:', tx.hash);
// const result = {
//   response : tx.hash
// }
//  return res.status(200).send(result)
// }
// catch(err){
//   console.log("Insufficient Funds")
//   return res.status(401).send("Insufficient Balance")
// }
// }
// else{
//   console.log("Invalid Address")
//   const result = {
//     response : "Invalid Address"
//   }
//   return res.status(400).send(result)
// }




// const nonce = await web3.eth.getTransactionCount(from, "latest");

// var amountto = parseInt(amount);
//  const transaction = {
//    to: to,
//    //  '0x5164F205c6a7f3fEfEe9e7C409012E0F4384c242', // faucet address to return eth
//    value: amountto,
//    //  100000000000
//    gas: 30000,
//    maxPriorityFeePerGas: 1000000108,
//    nonce: nonce,
//    // optional data field to send message or execute smart contract
//  };

//  const signedTx = await web3.eth.accounts.signTransaction(
//    transaction,
//    PRIVATE_KEY
//  );

//  web3.eth.sendSignedTransaction(
//    signedTx.rawTransaction,
//    function (error, hash) {
//      if (!error) {
//        // console.log(
//        //   "🎉 The hash of your transaction is: ",
//        //   hash,
//        //   "\n Check Alchemy's Mempool to view the status of your transaction!"
//        // );
//       //  alert("🎉 The hash of your transaction is: ",hash, "\n Check Alchemy's Mempool to view the status of your transaction!")
//       var a = "🎉 The hash of your transaction is: "+hash+"\n Check Alchemy's Mempool to view the status of your transaction!"
//       console.log(a);
//       return res.status(200).send(a)
//      } else {
//        // console.log(
//        //   "❗Something went wrong while submitting your transaction:",
//        //   error
//        // );

//       //  alert("❗Something went wrong while submitting your transaction:", error);
//       var b = "❗Something went wrong while submitting your transaction:"+error
//       console.log(b);
//       return res.status(200).send(b)
//      }
//    }
//  );

})  

// app.get('/transfertcn',async function (req,res){
//   // const web3 = new Web3('https://eth-goerli.g.alchemy.com/v2/d3XAlD6RgOfYQmBcWd59GVxLYki-b9bQ');
//   var key = req.query.key
//   var from = req.query.from
//   var to = req.query.to
//   var amount = req.query.val
//   var rpc = req.query.rpc
//   var token_address = req.query.taddress
//   console.log(rpc);
//   const token = await jwt.verify(
//     key , JWT_SECRETKEY
//   )
//   const pkey = {
//    privateKey: token,
//   }
//   var PRIVATE_KEY = pkey.privateKey.privateKey
//    console.log(PRIVATE_KEY);
//   console.log(rpc,"yaahan rpc hai");
//    var receiptAddress = from
//     console.log("wallet address "+receiptAddress)
//     // var amount = req.body.token
//     console.log("amount "+amount)
//     // var CONTRACT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"
//     var CONTRACT_ADDRESS = token_address;
//     var privateKey = PRIVATE_KEY 
//     privateKey = privateKey
//     console.log("privateKey "+privateKey)
//     console.log(rpc)
//     const abi = [
//       {
//           "constant": true,
//           "inputs": [],
//           "name": "name",
//           "outputs": [
//               {
//                   "name": "",
//                   "type": "string"
//               }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//       },
//       {
//           "constant": false,
//           "inputs": [
//               {
//                   "name": "_upgradedAddress",
//                   "type": "address"
//               }
//           ],
//           "name": "deprecate",
//           "outputs": [],
//           "payable": false,
//           "stateMutability": "nonpayable",
//           "type": "function"
//       },
//       {
//           "constant": false,
//           "inputs": [
//               {
//                   "name": "_spender",
//                   "type": "address"
//               },
//               {
//                   "name": "_value",
//                   "type": "uint256"
//               }
//           ],
//           "name": "approve",
//           "outputs": [],
//           "payable": false,
//           "stateMutability": "nonpayable",
//           "type": "function"
//       },
//       {
//           "constant": true,
//           "inputs": [],
//           "name": "deprecated",
//           "outputs": [
//               {
//                   "name": "",
//                   "type": "bool"
//               }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//       },
//       {
//           "constant": false,
//           "inputs": [
//               {
//                   "name": "_evilUser",
//                   "type": "address"
//               }
//           ],
//           "name": "addBlackList",
//           "outputs": [],
//           "payable": false,
//           "stateMutability": "nonpayable",
//           "type": "function"
//       },
//       {
//           "constant": true,
//           "inputs": [],
//           "name": "totalSupply",
//           "outputs": [
//               {
//                   "name": "",
//                   "type": "uint256"
//               }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//       },
//       {
//           "constant": false,
//           "inputs": [
//               {
//                   "name": "_from",
//                   "type": "address"
//               },
//               {
//                   "name": "_to",
//                   "type": "address"
//               },
//               {
//                   "name": "_value",
//                   "type": "uint256"
//               }
//           ],
//           "name": "transferFrom",
//           "outputs": [],
//           "payable": false,
//           "stateMutability": "nonpayable",
//           "type": "function"
//       },
//       {
//           "constant": true,
//           "inputs": [],
//           "name": "upgradedAddress",
//           "outputs": [
//               {
//                   "name": "",
//                   "type": "address"
//               }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//       },
//       {
//           "constant": true,
//           "inputs": [
//               {
//                   "name": "",
//                   "type": "address"
//               }
//           ],
//           "name": "balances",
//           "outputs": [
//               {
//                   "name": "",
//                   "type": "uint256"
//               }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//       },
//       {
//           "constant": true,
//           "inputs": [],
//           "name": "decimals",
//           "outputs": [
//               {
//                   "name": "",
//                   "type": "uint256"
//               }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//       },
//       {
//           "constant": true,
//           "inputs": [],
//           "name": "maximumFee",
//           "outputs": [
//               {
//                   "name": "",
//                   "type": "uint256"
//               }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//       },
//       {
//           "constant": true,
//           "inputs": [],
//           "name": "_totalSupply",
//           "outputs": [
//               {
//                   "name": "",
//                   "type": "uint256"
//               }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//       },
//       {
//           "constant": false,
//           "inputs": [],
//           "name": "unpause",
//           "outputs": [],
//           "payable": false,
//           "stateMutability": "nonpayable",
//           "type": "function"
//       },
//       {
//           "constant": true,
//           "inputs": [
//               {
//                   "name": "_maker",
//                   "type": "address"
//               }
//           ],
//           "name": "getBlackListStatus",
//           "outputs": [
//               {
//                   "name": "",
//                   "type": "bool"
//               }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//       },
//       {
//           "constant": true,
//           "inputs": [
//               {
//                   "name": "",
//                   "type": "address"
//               },
//               {
//                   "name": "",
//                   "type": "address"
//               }
//           ],
//           "name": "allowed",
//           "outputs": [
//               {
//                   "name": "",
//                   "type": "uint256"
//               }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//       },
//       {
//           "constant": true,
//           "inputs": [],
//           "name": "paused",
//           "outputs": [
//               {
//                   "name": "",
//                   "type": "bool"
//               }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//       },
//       {
//           "constant": true,
//           "inputs": [
//               {
//                   "name": "who",
//                   "type": "address"
//               }
//           ],
//           "name": "balanceOf",
//           "outputs": [
//               {
//                   "name": "",
//                   "type": "uint256"
//               }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//       },
//       {
//           "constant": false,
//           "inputs": [],
//           "name": "pause",
//           "outputs": [],
//           "payable": false,
//           "stateMutability": "nonpayable",
//           "type": "function"
//       },
//       {
//           "constant": true,
//           "inputs": [],
//           "name": "getOwner",
//           "outputs": [
//               {
//                   "name": "",
//                   "type": "address"
//               }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//       },
//       {
//           "constant": true,
//           "inputs": [],
//           "name": "owner",
//           "outputs": [
//               {
//                   "name": "",
//                   "type": "address"
//               }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//       },
//       {
//           "constant": true,
//           "inputs": [],
//           "name": "symbol",
//           "outputs": [
//               {
//                   "name": "",
//                   "type": "string"
//               }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//       },
//       {
//           "constant": false,
//           "inputs": [
//               {
//                   "name": "_to",
//                   "type": "address"
//               },
//               {
//                   "name": "_value",
//                   "type": "uint256"
//               }
//           ],
//           "name": "transfer",
//           "outputs": [],
//           "payable": false,
//           "stateMutability": "nonpayable",
//           "type": "function"
//       },
//       {
//           "constant": false,
//           "inputs": [
//               {
//                   "name": "newBasisPoints",
//                   "type": "uint256"
//               },
//               {
//                   "name": "newMaxFee",
//                   "type": "uint256"
//               }
//           ],
//           "name": "setParams",
//           "outputs": [],
//           "payable": false,
//           "stateMutability": "nonpayable",
//           "type": "function"
//       },
//       {
//           "constant": false,
//           "inputs": [
//               {
//                   "name": "amount",
//                   "type": "uint256"
//               }
//           ],
//           "name": "issue",
//           "outputs": [],
//           "payable": false,
//           "stateMutability": "nonpayable",
//           "type": "function"
//       },
//       {
//           "constant": false,
//           "inputs": [
//               {
//                   "name": "amount",
//                   "type": "uint256"
//               }
//           ],
//           "name": "redeem",
//           "outputs": [],
//           "payable": false,
//           "stateMutability": "nonpayable",
//           "type": "function"
//       },
//       {
//           "constant": true,
//           "inputs": [
//               {
//                   "name": "_owner",
//                   "type": "address"
//               },
//               {
//                   "name": "_spender",
//                   "type": "address"
//               }
//           ],
//           "name": "allowance",
//           "outputs": [
//               {
//                   "name": "remaining",
//                   "type": "uint256"
//               }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//       },
//       {
//           "constant": true,
//           "inputs": [],
//           "name": "basisPointsRate",
//           "outputs": [
//               {
//                   "name": "",
//                   "type": "uint256"
//               }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//       },
//       {
//           "constant": true,
//           "inputs": [
//               {
//                   "name": "",
//                   "type": "address"
//               }
//           ],
//           "name": "isBlackListed",
//           "outputs": [
//               {
//                   "name": "",
//                   "type": "bool"
//               }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//       },
//       {
//           "constant": false,
//           "inputs": [
//               {
//                   "name": "_clearedUser",
//                   "type": "address"
//               }
//           ],
//           "name": "removeBlackList",
//           "outputs": [],
//           "payable": false,
//           "stateMutability": "nonpayable",
//           "type": "function"
//       },
//       {
//           "constant": true,
//           "inputs": [],
//           "name": "MAX_UINT",
//           "outputs": [
//               {
//                   "name": "",
//                   "type": "uint256"
//               }
//           ],
//           "payable": false,
//           "stateMutability": "view",
//           "type": "function"
//       },
//       {
//           "constant": false,
//           "inputs": [
//               {
//                   "name": "newOwner",
//                   "type": "address"
//               }
//           ],
//           "name": "transferOwnership",
//           "outputs": [],
//           "payable": false,
//           "stateMutability": "nonpayable",
//           "type": "function"
//       },
//       {
//           "constant": false,
//           "inputs": [
//               {
//                   "name": "_blackListedUser",
//                   "type": "address"
//               }
//           ],
//           "name": "destroyBlackFunds",
//           "outputs": [],
//           "payable": false,
//           "stateMutability": "nonpayable",
//           "type": "function"
//       },
//       {
//           "inputs": [
//               {
//                   "name": "_initialSupply",
//                   "type": "uint256"
//               },
//               {
//                   "name": "_name",
//                   "type": "string"
//               },
//               {
//                   "name": "_symbol",
//                   "type": "string"
//               },
//               {
//                   "name": "_decimals",
//                   "type": "uint256"
//               }
//           ],
//           "payable": false,
//           "stateMutability": "nonpayable",
//           "type": "constructor"
//       },
//       {
//           "anonymous": false,
//           "inputs": [
//               {
//                   "indexed": false,
//                   "name": "amount",
//                   "type": "uint256"
//               }
//           ],
//           "name": "Issue",
//           "type": "event"
//       },
//       {
//           "anonymous": false,
//           "inputs": [
//               {
//                   "indexed": false,
//                   "name": "amount",
//                   "type": "uint256"
//               }
//           ],
//           "name": "Redeem",
//           "type": "event"
//       },
//       {
//           "anonymous": false,
//           "inputs": [
//               {
//                   "indexed": false,
//                   "name": "newAddress",
//                   "type": "address"
//               }
//           ],
//           "name": "Deprecate",
//           "type": "event"
//       },
//       {
//           "anonymous": false,
//           "inputs": [
//               {
//                   "indexed": false,
//                   "name": "feeBasisPoints",
//                   "type": "uint256"
//               },
//               {
//                   "indexed": false,
//                   "name": "maxFee",
//                   "type": "uint256"
//               }
//           ],
//           "name": "Params",
//           "type": "event"
//       },
//       {
//           "anonymous": false,
//           "inputs": [
//               {
//                   "indexed": false,
//                   "name": "_blackListedUser",
//                   "type": "address"
//               },
//               {
//                   "indexed": false,
//                   "name": "_balance",
//                   "type": "uint256"
//               }
//           ],
//           "name": "DestroyedBlackFunds",
//           "type": "event"
//       },
//       {
//           "anonymous": false,
//           "inputs": [
//               {
//                   "indexed": false,
//                   "name": "_user",
//                   "type": "address"
//               }
//           ],
//           "name": "AddedBlackList",
//           "type": "event"
//       },
//       {
//           "anonymous": false,
//           "inputs": [
//               {
//                   "indexed": false,
//                   "name": "_user",
//                   "type": "address"
//               }
//           ],
//           "name": "RemovedBlackList",
//           "type": "event"
//       },
//       {
//           "anonymous": false,
//           "inputs": [
//               {
//                   "indexed": true,
//                   "name": "owner",
//                   "type": "address"
//               },
//               {
//                   "indexed": true,
//                   "name": "spender",
//                   "type": "address"
//               },
//               {
//                   "indexed": false,
//                   "name": "value",
//                   "type": "uint256"
//               }
//           ],
//           "name": "Approval",
//           "type": "event"
//       },
//       {
//           "anonymous": false,
//           "inputs": [
//               {
//                   "indexed": true,
//                   "name": "from",
//                   "type": "address"
//               },
//               {
//                   "indexed": true,
//                   "name": "to",
//                   "type": "address"
//               },
//               {
//                   "indexed": false,
//                   "name": "value",
//                   "type": "uint256"
//               }
//           ],
//           "name": "Transfer",
//           "type": "event"
//       },
//       {
//           "anonymous": false,
//           "inputs": [],
//           "name": "Pause",
//           "type": "event"
//       },
//       {
//           "anonymous": false,
//           "inputs": [],
//           "name": "Unpause",
//           "type": "event"
//       }
//                 ];
  
//   // const provider = new JsonRpcProvider("https://bsc-dataseed.binance.org/"); // Connect to Ropsten testnet
//   const provider = new Web3(rpc);
//   const wallet = new ethers.Wallet(privateKey, provider);
//   const amountConvert = parseUnits(amount,18)
//   const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
//   if(isAddress(receiptAddress)){
//     try{
//   const tx = await contract.transfer(receiptAddress, amountConvert);
//   console.log('Transaction hash:', tx.hash);
//   const result = {
//     response : tx.hash
//   }
//    return res.status(200).send(result)
//   }
//   catch(err){
//     console.log("Insufficient Funds")
//     return res.status(401).send("Insufficient Balance")
//   }
//   }
//   else{
//     console.log("Invalid Address")
//     const result = {
//       response : "Invalid Address"
//     }
//     return res.status(400).send(result)
//   }
// })
/////////////transfer //////////


// insert
// app.post('/addimp', function(req, res) {
//   res.setHeader('Content-Type', 'application/json');
// //  res.send("100");
//   let record = {
//       password : req.body.password,
//       secret_key : req.body.key,
//       wallet_address: req.body.address,
//       phrase: req.body.phrase
//   };
//   // console.log(record.value);
//   let sql = "INSERT INTO wallet_id SET ?";
//   connection.query(sql, record, (err) => {
//       if (err) throw err;
//       res.end();
//   });
// })

// app.get('/getdata1:cpassword',async function (req,res){
//   res.setHeader('Content-Type', 'application/json');
//     connection.query(`select * from wallet_id WHERE password = '${req.params.cpassword}'`, function (err, result) {
//     if (err) throw err;
//     res.send(result);
//     // console.log(result[0].Wallet_id);
//   });
// })






// app.post('/addnew', function(req, res) {
//     res.setHeader('Content-Type', 'application/json');
//   //  res.send("100");
//     let record = {
//         password : req.body.password,
//     };
    
//     // console.log(record.value);

//     let sql = "INSERT INTO wallet_id SET ?";
//     // console.log("successfully inserted");
//     connection.query(sql, record, (err) => {
//         if (err) throw err;
//         // console.log(err);
//         res.end();
//     });
// })

// app.get('/getdata1:p2',async function (req,res){
//     res.setHeader('Content-Type', 'application/json');
//       connection.query(`select * from wallet_id WHERE password = '${req.params.p2}'`, function (err, result) {
//       if (err) throw err;
//       res.send(result);
//       // console.log(result[0].Wallet_id);
//     });
// })

//////////////////////////////////////////////////////////////////////
// app.get('/phrase',async function (req,res){
//   res.setHeader('Content-Type', 'application/json');
//   var a=  req.query.phrase
//   // console.log(a);
//   await connection.query(`SELECT * FROM wallet_id where phrase = '${a}' `, async function (err, result) {
//     if (err) throw err;
//    await res.send(result);
//   });
// }) 

//////////////////////////////////////////////////////////////////////

// app.post('/updatedata/:id',async function(req,res) {
//   res.setHeader('Content-Type', 'application/json');
// //  res.send("100");

//   let record = {
//     phrase : req.body.phrase,
//     wallet_address : req.body.Address,
//     secret_key : req.body.Key,
//   };
  
//   // console.log(req.body.Content);
//   // console.log(req.body.id);
//   let sql = await `UPDATE wallet_id SET ? WHERE Wallet_id = ${req.params.id}`
//   // console.log("successfully inserted");
//   // phrase = "${req.body.phrase}"
//   connection.query(sql, record, (err) => {
//       if (err) throw err;
//       // console.log(err);
//       res.end();
//   });


// })

//////////////////////////////////////////////////////////////////////

app.get("/transfertcn", async (req, res) => {
  var receiptAddress = await req.query.to
  var Key = req.query.privateKey
  var amount = req.query.amount
  var tadrs = await req.query.tadrs
  var rpcUrl = req.query.rpc;
  
  const token = await jwt.verify(
    Key , JWT_SECRETKEY
      )
      const pkey = {
        Key: token,
      }
      var privateKey = pkey.Key.privateKey
//  console.log("Privet Key   "+privateKey);

//   console.log("wallet address  "+receiptAddress)
//   console.log("recever address "+tadrs)
//   console.log("amount  "+amount)
  var CONTRACT_ADDRESS = tadrs
  
  // privateKey = "0x".concat(privateKey)
  // console.log("privateKey "+privateKey)
  // console.log(receiptAddress,privateKey,amount,tokenContractAddress,rpcUrl)
  const abi = require("./contract.json")

const provider = new JsonRpcProvider(rpcUrl); // Connect to Ropsten testnet
const wallet = new ethers.Wallet(privateKey, provider);
const amountConvert = parseUnits(amount,18)
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
if(isAddress(receiptAddress)){
  try{
const tx = await contract.transfer(receiptAddress, amountConvert);
console.log('Transaction hash:', tx.hash);
const data = {
  response : tx.hash
}
return res.status(200).send(data);
}
catch(err){
  console.log("Insufficient Funds")
  let data = {
    response : 1
  }
  console.log('Transaction receipt:', receipt);
  return res.status(200).send(data);
  // return res.status(401).send("Insufficient Balance")
}
}
else{
  console.log("Invalid Address")
  // const data = {
  //   response : "Invalid Address"
  // }
  let data = {
    response : 1
  }
  console.log('Transaction receipt:', receipt);
  return res.status(200).send(data);
  // return res.status(400).send(data)
}
});

app.post("/swapf3", async (req, res) => {
  console.log('Swapppppp');
    try{
    var gass = 371938;
    var privateKey = req.body.privateKey;
    var amount = req.body.inputAmount;
    // privateKey = "0x".concat(privateKey);
    console.log(privateKey)
    const web3 = new Web3('https://bsc-dataseed.binance.org/');
  //const privateKey = '0xa2ee5a60a7a875b4647349edc04b9443c488b5ba614bbcee99360813e1323bd5';
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  console.log(account.address);
  const pancakeSwapAddress = '0x10ed43c718714eb63d5aa57b78b54704e256024e';
  const pancakeSwapABI = require('./abi.json');
  const pancakeSwapContract = new web3.eth.Contract(pancakeSwapABI, pancakeSwapAddress);
  const inputTokenAddress = req.body.inToken;
  const outputTokenAddress = req.body.outToken;
  const inputAmount = web3.utils.toWei(amount, 'ether');
  const minOutputAmount = web3.utils.toWei('0', 'ether');
  //// approval part
  const tokenabi = require('./abif3.json');
  const tokencontract = new web3.eth.Contract(tokenabi, inputTokenAddress);
  web3.eth.accounts.wallet.add(privateKey);
  try{
  const approves = await tokencontract.methods
       .approve(
        pancakeSwapAddress,
        inputAmount
      )
     .send({ from: account.address, gasLimit: 275833 });
      console.log(approves.transactionHash)
    }
    catch(err){
     return res.status(401).send("Insufficient funds");
  
    }
  /////
  console.log(inputAmount,minOutputAmount)
  
  const swapData = pancakeSwapContract.methods.swapExactTokensForTokens(
      inputAmount,
      minOutputAmount,
      [inputTokenAddress, outputTokenAddress],
      account.address,
      Date.now() + 1000 * 60 * 10 // set to expire after 10 minutes
    ).encodeABI();
  
  
    var block = await web3.eth.getBlock("latest");
  
  var gasLimit = Math.round(block.gasLimit / block.transactions.length);
  // console.log(block,gasLimit)
  var tx = {
      gas: gasLimit,
      to: pancakeSwapAddress,
      data: swapData
  }
  web3.eth.accounts.wallet.add(privateKey);
    try{
     const swapTransaction = await pancakeSwapContract.methods
       .swapExactTokensForTokens(
         inputAmount,
         minOutputAmount,
         [inputTokenAddress,outputTokenAddress],
         account.address,
         Date.now() + 1000 * 60 * 10 // set to expire after 10 minutes
      )
     .send({ from: account.address, gasLimit: gass });
    console.log(swapTransaction.transactionHash)
      res.status(200).send("Swap Successful")
       }
       catch(error){
        console.log("error hai",error)
        return res.status(401).send("Insufficient Funds")
       }
      }
      catch(err){
        return res.status(400).send("Insufficient Funds")
      }
  
  })
  
  app.post("/nonNativetoNative", async (req, res) => { 
    //ye BNB to MMIT wala h hai? ha bs mmit ki jagha address change ho raha hy
    console.log('SwappppppNative');
    var Key = req.body.privateKey
    var Url = req.body.uri
    var Ammount = req.body.inputAmount
    var gass = 371938;
    
    // var addressFrom = '0x9767c8E438Aa18f550208e6d1fDf5f43541cC2c8'
    var addressTo = req.body.outToken

    console.log(Key);
    console.log(Url);
    console.log(Ammount);
    // console.log(addressFrom);
    // there?
    console.log(addressTo);
    try
    {
    var privateKey = Key;
    var amount = Ammount;
    // privateKey = "0x".concat(privateKey);
    const web3 = new Web3(Url);
    // const privateKey = '0xa2ee5a60a7a875b4647349edc04b9443c488b5ba614bbcee99360813e1323bd5';
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    console.log("Account Address 123 " +account.address);
    const pancakeSwapAddress = '0x10ed43c718714eb63d5aa57b78b54704e256024e';
    const pancakeSwapABI = require('./abi.json');
    const pancakeSwapContract = new web3.eth.Contract(pancakeSwapABI, pancakeSwapAddress);
    // const inputTokenAddress = req.body.inToken;
    // const outputTokenAddress = req.body.outToken;
    const inputAmount = web3.utils.toWei(amount, 'ether');
    const minOutputAmount = web3.utils.toWei('0', 'ether');
    //// approval part
    const tokenabi = require('./abif3.json'); //same isseu
    
    
    const swapData = pancakeSwapContract.methods.swapExactETHForTokens(
        minOutputAmount,
        ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',addressTo],
        account.address,
        Date.now() + 1000 * 60 * 10 // set to expire after 10 minutes
    ).encodeABI();
    
    
    var block = await web3.eth.getBlock("latest");
    
    var gasLimit = Math.round(block.gasLimit / block.transactions.length);
    console.log("Gas fee "+gasLimit)
    // console.log(block,gasLimit)
    var tx = {
      gas: gasLimit,
      to: pancakeSwapAddress,
      data: swapData
    }
    web3.eth.accounts.wallet.add(privateKey);
    try{
      //hit krna api chalao ab ok
     const swapTransaction = await pancakeSwapContract.methods
       .swapExactETHForTokens(
        
         minOutputAmount,
         ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',addressTo],
         account.address,
         Date.now() + 1000 * 60 * 10 // set to expire after 10 minutes
      )
     .send({ from: account.address, gasLimit: gass,value : inputAmount });
      console.log(swapTransaction.transactionHash)
      res.status(200).send("Swap Successful"+swapTransaction.transactionHash)
       }
       catch(error){
        console.log("error hai",error)
        console.log(error)
        return res.status(400).send(error.message)
       }
      }
      catch(err){
        console.log(error)
        return res.status(400).send(error.message)
      }
  });
  
  app.post("/swapf3ConversionAmount", async (req, res) => {
    var uri = req.body.uri
    var inToken = req.body.inToken
    var outToken = req.body.outToken
    var input = req.body.input
   
    // console.log(uri  + " " + inToken + " " + outToken);
  
    try{
    const web3 = new Web3(uri);
  //const privateKey = '0xa2ee5a60a7a875b4647349edc04b9443c488b5ba614bbcee99360813e1323bd5';
    const pancakeSwapAddress = '0x10ed43c718714eb63d5aa57b78b54704e256024e';
    const pancakeSwapABI = require('./abi.json');
    const pancakeSwapContract = new web3.eth.Contract(pancakeSwapABI, pancakeSwapAddress);
    const inputTokenAddress = inToken;
    const outputTokenAddress = outToken;
    const inputAmount = web3.utils.toWei(input , 'ether');
    const minOutputAmount = web3.utils.toWei('0', 'ether');
  
    const amounts = await pancakeSwapContract.methods.getAmountsOut(inputAmount, [inputTokenAddress, outputTokenAddress]).call();
    const estimatedOutputAmount = amounts[1];
    console.log("Amounts : "+web3.utils.fromWei(estimatedOutputAmount,'ether'))
  
    const gasPrice = await web3.eth.getGasPrice();
    const gasFee = web3.utils.toBN(gasPrice).mul(web3.utils.toBN(21000));
    console.log("Gas fee "+gasFee)
  
    const estimatedOutputAmountInEth = web3.utils.fromWei(estimatedOutputAmount, 'ether');
    const gasFeeInEth = web3.utils.fromWei(gasFee, 'ether');
    const totalCostInEth = parseFloat(estimatedOutputAmountInEth) + parseFloat(gasFeeInEth);
    console.log(`Estimated output amount: ${estimatedOutputAmountInEth} USDT`);
    console.log(`Gas fee: ${gasFeeInEth} BNB`);
    console.log(`Total cost: ${totalCostInEth} BNB`);
    const result = {
      estimatedOutputAmount : estimatedOutputAmountInEth,
      gasFee : gasFeeInEth,
      totalCost : totalCostInEth
    }
  return res.status(200).send(result)
      }
      catch(err){
        return res.status(400).send("Wrong Input")
      }
  
  
  
  
  
  
  
  // try{
  // const Web3 = require('web3');
  // const web3 = new Web3('https://mainnet.infura.io/v3/8f99e25e35fb47be849213a3438a0c14');
  
  // const uniswapAbi = require('./uniswap-abi.json'); // Replace with the path to the ABI file
  // const uniswapAddress = '0x7a250d5630b4cf539739df2c5dacb4c659f2488d'; // Replace with the address of the Uniswap exchange on the Ethereum network
  // const uniswapExchange = new web3.eth.Contract(uniswapAbi, uniswapAddress);
  
  // const inputTokenAddress = inToken; // Replace with the address of the input token, for example DAI
  // const outputTokenAddress = outToken; // Replace with the address of the output token, for example ETH
  // const outputAmount = web3.utils.toWei('1', 'ether'); // Replace with the desired output amount in wei, for example 1 ETH
  
  // console.log(outputAmount);
  // const tokenInPrice = await uniswapExchange.methods.getAmountIn(outputAmount, inputTokenAddress, outputTokenAddress).call();
  
  // const inputAmount = web3.utils.fromWei(tokenInPrice, 'ether'); // Convert from wei to ether, assuming the input token has 18 decimals
  // console.log(`Input token amount: ${inputAmount}`);
  
  // }
  // catch(err){
  //   console.log(err);
  // }
  
  });
  

var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});

