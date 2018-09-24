import Web3 from "web3"

export const contractAddress = "0xf3e993DF85EA670d50C4EB280527d787d1aee2E8"
let web3 = null

export const abi = [
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    name: "games",
    outputs: [
      {
        name: "id",
        type: "uint256"
      },
      {
        name: "lastBoard",
        type: "uint8"
      },
      {
        name: "toPlay",
        type: "address"
      },
      {
        name: "winner",
        type: "address"
      },
      {
        name: "challenger",
        type: "address"
      },
      {
        name: "accepter",
        type: "address"
      },
      {
        name: "inPlay",
        type: "bool"
      },
      {
        name: "created",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x117a5b90"
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "address"
      }
    ],
    name: "userGames",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x8ec58539"
  },
  {
    inputs: [
      {
        name: "_royalty",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
    signature: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "payee",
        type: "address"
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256"
      }
    ],
    name: "Claim",
    type: "event",
    signature:
      "0x47cee97cb7acd717b3c0aa1435d004cd5b3c8c57d70dbceb4e4458bbd60e39d4"
  },
  {
    constant: false,
    inputs: [
      {
        name: "rate",
        type: "uint256"
      }
    ],
    name: "createGame",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x48e837b9"
  },
  {
    constant: false,
    inputs: [
      {
        name: "id",
        type: "uint256"
      }
    ],
    name: "getGameBoard",
    outputs: [
      {
        name: "",
        type: "address[9][9]"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x1a2361e7"
  },
  {
    constant: false,
    inputs: [
      {
        name: "id",
        type: "uint256"
      }
    ],
    name: "joinGame",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xefaa55a0"
  },
  {
    constant: false,
    inputs: [
      {
        name: "id",
        type: "uint8"
      },
      {
        name: "inner",
        type: "uint8"
      },
      {
        name: "outer",
        type: "uint8"
      }
    ],
    name: "makeMove",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x960edffb"
  }
]

export const connectMetamask = async () => {
  try {
    web3 = await new Web3(window.web3.currentProvider)
    console.log("web3: ", web3)
    web3.eth
      .getAccounts()
      .then(accounts => {
        if (accounts.length > 0) {
          console.log("using account " + accounts[0])
        } else {
          alert("Please unlock Meta Mask and try again")
        }
      })
      .catch(error => {
        alert("Transaction cancelled " + error)
      })
    return web3
  } catch (error) {
    console.error("Please install MetaMask to continue", error.message)
    alert("Please install MetaMask and try again")
  }
}
export const joinGame = async gameId => {
  if (web3 == null) {
    await connectMetamask()
  }
  const contractInstance = await new web3.eth.Contract(abi, contractAddress)
  web3.eth
    .getAccounts()
    .then(accounts => {
      contractInstance.methods.joinGame(gameId).send({ from: accounts[0] })
    })
    .catch(error => {
      alert("Transaction cancelled " + error)
    })
}

export const newGame = async rate => {
  if (web3 == null) {
    await connectMetamask()
  }
  const contractInstance = await new web3.eth.Contract(abi, contractAddress)
  web3.eth
    .getAccounts()
    .then(accounts => {
      contractInstance.methods.createGame(rate).send({ from: accounts[0] })
    })
    .catch(error => {
      alert("Transaction cancelled " + error)
    })
}
export const makeMove = async (gameId, inner_idx, outer_idx) => {
  if (web3 == null) {
    await connectMetamask()
  }
  const contractInstance = await new web3.eth.Contract(abi, contractAddress)
  const accounts = await web3.eth.getAccounts()
  let response = ""
  await contractInstance.methods
    .makeMove(gameId, inner_idx, outer_idx)
    .send({ from: accounts[0] })
    .on("transactionHash", hash => {
      console.log("TX Hash", hash)
    })
    .then(receipt => {
      console.log("Mined", receipt)
      if (receipt.status == "0x1" || receipt.status == 1) {
        console.log("Transaction Success")
        response = null
      } else {
        console.log("Transaction Failed")
        response = "Transaction Failed"
      }
    })
    .catch(err => {
      const errorMessage = err.toString().split(":")
      response = errorMessage[errorMessage.length - 1].replace("revert ", "")
    })
    .finally(() => {
      console.log("Extra Code After Everything")
    })
  console.log("result " + response)
  return response
}
