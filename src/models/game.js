import store from "./store"
import {
  makeMove,
  connectMetamask,
  newGame,
  joinGame
} from "../components/web3/contract"
const game = {
  state: {
    size: 3,
    squares: [[], []],
    localWinners: [],
    lastMoveLocation: {},
    xIsNext: true,
    winner: null,
    errorMessage: "",
    isFetching: true,
    boardSize: 3,
    joinGame: false,
    game: 1,
    matchID: 0
  },

  reducers: {
    update(state, payload) {
      return { ...state, ...payload }
    }
  },

  effects: {
    async hydrate(previousState) {
      //like starting again...
      try {
        // get the game state object and hydrate it
        const { dispatch } = store
        const size = 3
        let squares = Array(size * size).fill(
          // Outer squares
          Array(size * size).fill(null)
        ) // Inner squares
        let localWinners = Array(size * size).fill(null)
        console.log("hydrate squares", squares)
        let lastMoveLocation = {
          row: null,
          col: null,
          outerRow: null,
          outerCol: null
        }
        let winner = null
        // if (this.web3 == null) {
        //   this.web3 = await connectMetamask()
        // }
        // dispatch.participant.update({ round: icoDetails.round.sequence })
        // dispatch.rates.update({ token: 1 / icoDetails.targetTokenPrice })
        this.update({
          squares,
          localWinners,
          lastMoveLocation,
          winner,
          isFetching: false
        })
        // this.update(icoDetails)
      } catch (error) {
        console.error(`Failed to hydrate game state: ${error}`)
      }
    },
    async updateGame(update, rootState) {
      console.log("stae: ", rootState)
      console.log("update: ", update)
      this.update(update)
    },
    async handleNewGame() {
      try {
        const {
          dispatch: { iface }
        } = store
        // if (this.web3 == null) {
        //   this.web3 = await connectMetamask()
        // }

        // this.setState((prevState, props) => ({
        //   matchID: prevState.matchID + 1
        // }))
        //change to newGame eventually
        const rate = 1000
        await newGame(rate)
      } catch (error) {
        console.log("new game threw an error ", error)
      }
    },
    async makeMove(inner_idx, outer_idx, rootState) {
      const { game } = rootState
      const gameId = 1
      console.log("game id " + gameId)
      try {
        // if (this.web3 == null) {
        //   this.web3 = await connectMetamask()
        // }
        // const response = await makeMove(gameId, inner_idx, outer_idx)
        // return response
        return true
      } catch (error) {
        console.log("making move threw an error ", error)
        return null
      }
    },
    async handleJoinGame(gameId) {
      try {
        // if (this.web3 == null) {
        //   this.web3 = await connectMetamask()
        // }
        console.log("attempting to join game " + gameId)
        //change to newGame eventually
        await joinGame(gameId)
      } catch (error) {
        console.log("joining game threw an error ", error)
      }
    }
  }
}

export default game
