// // const config = require("../config")
// const EVMRevert = require("./helpers/EVMRevert")
// // const { EVMThrow } = require("./helpers/EVMThrow")
// // const { expectThrow } = require("./helpers/expectThrow")
// // const { advanceToBlock } = require("./helpers/advanceToBlock")
// const { increaseTimeTo, duration } = require("./helpers/increaseTime")
// // const { latestTime } = require("./helpers/latestTime")
// // const { advanceBlock } = require("./helpers/advanceToBlock")
// const chaiAsPromised = require("chai-as-promised")
// const chaiDateTime = require("chai-datetime")
// const bnChai = require("bn-chai")

// const { BN } = web3.utils

// require("chai")
//   .use(bnChai(BN))
//   .use(chaiAsPromised)
//   .use(chaiDateTime)
//   .should()

// global.web3 = web3
// const CrazyToes = artifacts.require("./TicTacToe.sol")

// function ether(n) {
//   return new BN(web3.utils.toWei("" + n, "ether"))
// }
// contract(
//   "Crazy Toes",
//   async ([challenger, accepter, spectator, ...accounts]) => {
//     const bet = 0.1
//     const betInEther = ether(bet)
//     const royalty = ether(bet / 10)
//     beforeEach(async function() {
//       const block = await web3.eth.getBlock("latest")
//       this.endTime = new BN(block.timestamp + 86400 * 3) // 3 days in the future

//       this.afterEndTime = this.endTime.add(new BN(duration.seconds(1)))

//       this.crazyToes = await CrazyToes.new(royalty)
//       await this.crazyToes.createGame(betInEther, this.endTime)
//       this.id = await this.crazyToes.userGames.call(challenger)
//       console.log("game id: " + this.id)
//     })
//     describe("testing initial conditions and creation of the game", function() {
//       it("should start with an empty board", async function() {
//         //check that the board is empty
//         // console.log("this id ", this.id)
//         const board = await this.crazyToes.getGameBoard.call(this.id)
//         let allPass = true
//         for (var i = 0, l = board.length; i < l; i++) {
//           allPass = board[i] == 0 ? true : false
//         }
//         expect(allPass).to.be.true
//       })

//       it("check that the challenger is not currently in the middle of a game", async function() {
//         const gameId = await this.crazyToes.userGames.call(challenger)
//         gameId.should.not.eq.BN(new BN(0))
//       })
//       it("should check that the endTime is far engouh in the future for a game", async function() {
//         expect(true).to.be.true
//       })
//     })
//     describe("testing a user joining a game", function() {
//       beforeEach(async function() {
//         //need to find a game to join and join it
//       })
//       it("should stop the challenger being the opponent", async function() {
//         //if its the challenger, it should be rejected
//       })
//       it("should not allow you to join a game that is in play", async function() {
//         //check if the game is currently in play
//       })
//       it("should not allow a player to join/play multiple games at once", async function() {})
//       it("should not allow you to join a game that is in play", async function() {})
//     })
//     // describe("playing games and making moves", function() {
//     //   it("should not allow you to play somewhere that has already been player", async function() {})
//     //   it("should not allow you to play in a game that has already been won", async function() {})
//     //   it("should not allow someone who is not part of the game to play", async function() {})
//     //   it("should not allow you to play outside of the board area", async function() {})
//     //   it("should not allow you to play when its not your turn", async function() {})
//     // })
//     // describe("testing for a winner", function() {
//     //   it("should set the game up as complete/unplayable if a winner has been found", async function() {})
//     // })
//   }
// )
