// const config = require("../config")
const EVMRevert = require("./helpers/EVMRevert")
// const { EVMThrow } = require("./helpers/EVMThrow")
// const { expectThrow } = require("./helpers/expectThrow")
// const { advanceToBlock } = require("./helpers/advanceToBlock")
const { increaseTimeTo, duration } = require("./helpers/increaseTime")
// const { latestTime } = require("./helpers/latestTime")
// const { advanceBlock } = require("./helpers/advanceToBlock")
const chaiAsPromised = require("chai-as-promised")
const chaiDateTime = require("chai-datetime")
const bnChai = require("bn-chai")

const { BN } = web3.utils

require("chai")
  .use(bnChai(BN))
  .use(chaiAsPromised)
  .use(chaiDateTime)
  .should()

global.web3 = web3
const UltimateTicTacToe = artifacts.require("./UltimateTicTacToe.sol")

function ether(n) {
  return new BN(web3.utils.toWei("" + n, "ether"))
}
contract(
  "Crazy Toes",
  async ([
    creator,
    challenger,
    accepter,
    spectator,
    aggressor,
    ...accounts
  ]) => {
    const bet = 0.1
    const betInEther = ether(bet)
    const royalty = ether(bet / 10)
    beforeEach(async function() {
      const block = await web3.eth.getBlock("latest")
      this.endTime = new BN(block.timestamp + 86400 * 3) // 3 days in the future

      this.afterEndTime = this.endTime.add(new BN(duration.seconds(1)))

      this.ultimateTicTacToe = await UltimateTicTacToe.new(royalty)
      await this.ultimateTicTacToe.createGame(betInEther, { from: challenger }) //this.endTime
      this.id = await this.ultimateTicTacToe.userGames.call(challenger)
      console.log("game id: " + this.id)
      const game = await this.ultimateTicTacToe.games.call(10)
    })

    describe("testing initial conditions and creation of the game", function() {
      it("should start with an empty board", async function() {
        const board = await this.ultimateTicTacToe.getGameBoard.call(this.id)
        let allPass = true
        for (var i = 0, l = board.length; i < l; i++) {
          for (var j = 0, k = board[i].length; j < k; j++) {
            allPass = board[i][j] == 0 ? true : false
          }
        }
        expect(allPass).to.be.true
      })

      it("check that the challenger is not currently in the middle of a game", async function() {
        const gameId = await this.ultimateTicTacToe.userGames.call(challenger)
        gameId.should.not.eq.BN(new BN(0))
      })
      // it("should check that the endTime is far engouh in the future for a game", async function() {
      //   expect(true).to.be.true
      // })
      it("should stop the challenger being the opponent", async function() {
        //if its the challenger, it should be rejected
        this.ultimateTicTacToe
          .joinGame(this.id, {
            from: challenger
          })
          .should.be.rejectedWith(EVMRevert)
      })
    })
    describe("testing a user joining a game", function() {
      beforeEach(async function() {
        //need to find a game to join, and join it
        await this.ultimateTicTacToe.joinGame(this.id, {
          from: accepter
        }).should.be.fulfilled
        const acceptorId = await this.ultimateTicTacToe.userGames.call(accepter)
      })

      it("should not allow you to join a game that is in play", async function() {
        //check if the game is currently in play
        await this.ultimateTicTacToe
          .joinGame(this.id, {
            from: spectator
          })
          .should.be.rejectedWith(EVMRevert)
      })

      it("should not allow a player to join/play multiple games at once", async function() {
        await this.ultimateTicTacToe.createGame(betInEther, {
          from: aggressor
        }) //this.endTime
        this.agressorId = await this.ultimateTicTacToe.userGames.call(aggressor)
        await this.ultimateTicTacToe
          .joinGame(this.agressorId, {
            from: accepter
          })
          .should.be.rejectedWith(EVMRevert)
      })
    })
    describe("playing games and making moves", function() {
      beforeEach(async function() {
        //need to find a game to join, and join it
        await this.ultimateTicTacToe.joinGame(this.id, {
          from: accepter
        }).should.be.fulfilled
        const acceptorId = await this.ultimateTicTacToe.userGames.call(accepter)
      })
      it("should not allow you to play a move that is a game you are not part of", async function() {
        await this.ultimateTicTacToe
          .makeMove(this.agressorId, 0, 0, { from: spectator })
          .should.be.rejectedWith(EVMRevert)
      })
      it("should not allow you to create multiple games at once", async function() {
      it("should not allow you to play somewhere that has already been played", async function() {
        //challenger and acceptor are in the middle of a game
        await this.ultimateTicTacToe.makeMove(this.id, 0, 0, { from: accepter })
          .should.be.fulfilled
        //tests that they can't move twice
        await this.ultimateTicTacToe
          .makeMove(this.id, 0, 0, { from: accepter })
          .should.be.rejectedWith(EVMRevert)
        //tests that they can't play somewhere already played
        await this.ultimateTicTacToe
          .makeMove(this.id, 0, 0, { from: challenger })
          .should.be.rejectedWith(EVMRevert)
      })
      it("should not allow you to play in a game that has already been won", async function() {
        await this.ultimateTicTacToe.makeMove(this.id, 0, 0, { from: accepter })
          .should.be.fulfilled
        await this.ultimateTicTacToe.makeMove(this.id, 2, 0, {
          from: challenger
        }).should.be.fulfilled
        await this.ultimateTicTacToe.makeMove(this.id, 3, 2, { from: accepter })
          .should.be.fulfilled
        await this.ultimateTicTacToe.makeMove(this.id, 2, 3, {
          from: challenger
        }).should.be.fulfilled
        await this.ultimateTicTacToe.makeMove(this.id, 4, 2, { from: accepter })
          .should.be.fulfilled
        await this.ultimateTicTacToe.makeMove(this.id, 2, 4, {
          from: challenger
        }).should.be.fulfilled
        await this.ultimateTicTacToe.makeMove(this.id, 5, 2, { from: accepter })
          .should.be.fulfilled
        await this.ultimateTicTacToe.makeMove(this.id, 1, 5, {
          from: challenger
        }).should.be.fulfilled
        await this.ultimateTicTacToe.makeMove(this.id, 3, 1, { from: accepter })
          .should.be.fulfilled
        await this.ultimateTicTacToe.makeMove(this.id, 1, 3, {
          from: challenger
        }).should.be.fulfilled
        await this.ultimateTicTacToe.makeMove(this.id, 4, 1, { from: accepter })
          .should.be.fulfilled
        await this.ultimateTicTacToe.makeMove(this.id, 1, 4, {
          from: challenger
        }).should.be.fulfilled
        await this.ultimateTicTacToe.makeMove(this.id, 5, 1, { from: accepter })
          .should.be.fulfilled
        await this.ultimateTicTacToe.makeMove(this.id, 0, 5, {
          from: challenger
        }).should.be.fulfilled
        await this.ultimateTicTacToe.makeMove(this.id, 3, 0, { from: accepter })
          .should.be.fulfilled
        await this.ultimateTicTacToe.makeMove(this.id, 0, 3, {
          from: challenger
        }).should.be.fulfilled
        await this.ultimateTicTacToe.makeMove(this.id, 6, 0, { from: accepter })
          .should.be.fulfilled

        // games[id].inPlay = false;
        // games[id].winner = player;
        const game = await this.ultimateTicTacToe.games.call(this.id)
        const winner = game.winner
        const gameState = game.inPlay
        expect(winner == accepter).to.be.true
        expect(gameState).to.be.false
        await this.ultimateTicTacToe.makeMove(this.id, 1, 6, {
          from: challenger
        }).should.be.rejected
        //check that you cannot join a game that has been won

        await this.ultimateTicTacToe
          .joinGame(this.id, {
            from: aggressor
          })
          .should.be.rejectedWith(EVMRevert)
      })
      it("should not allow you to play outside of the board area", async function() {
        await this.ultimateTicTacToe
          .makeMove(this.id, -1, 0, { from: accepter })
          .should.be.rejectedWith(EVMRevert)
        await this.ultimateTicTacToe
          .makeMove(this.id, 0, -1, { from: accepter })
          .should.be.rejectedWith(EVMRevert)
        await this.ultimateTicTacToe
          .makeMove(this.id, 9, 0, { from: accepter })
          .should.be.rejectedWith(EVMRevert)
        await this.ultimateTicTacToe
          .makeMove(this.id, 0, 9, { from: accepter })
          .should.be.rejectedWith(EVMRevert)
        await this.ultimateTicTacToe.makeMove(this.id, 0, 0, { from: accepter })
          .should.be.fulfilled
      })
      it("should not allow you to play when its not your turn", async function() {
        await this.ultimateTicTacToe
          .makeMove(this.id, 0, 0, { from: challenger })
          .should.be.rejectedWith(EVMRevert)
        await this.ultimateTicTacToe.makeMove(this.id, 0, 0, { from: accepter })
          .should.be.fulfilled
      })
    })

    
    // describe("testing for a winner", function() {
    //   it("should set the game up as complete/unplayable if a winner has been found", async function() {})
    // })
  }
)
