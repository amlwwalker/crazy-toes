import React from "react"
import { newGame, joinGame, connectMetamask } from "./web3/contract"
import SettingsForm from "./settingsForm.js"
import Game from "./game.js"

export default class Interface extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      boardSize: 3,
      joinGame: false,
      game: 1,
      matchID: 0
    }
  }
  // this.web3.eth.sendTransaction({
  //   value: this.web3.utils.toWei("0.1", "ether"),
  //   from: accounts[0],
  //   to: contractAddress
  // })

  handleJoinGame = async gameId => {
    try {
      console.log("attempting to join game " + gameId)
      //change to newGame eventually
      // await joinGame(gameId)
    } catch (error) {
      console.log("joining game threw an error ", error)
    }
  }
  handleNewGame = async () => {
    try {
      if (this.web3 == null) {
        await connectMetamask()
      }

      // this.setState((prevState, props) => ({
      //   matchID: prevState.matchID + 1
      // }))
      //change to newGame eventually
      const rate = 1000
      // await newGame(rate)
    } catch (error) {
      console.log("new game threw an error ", error)
    }
  }

  render() {
    console.log("this.state.game " + this.state.game)
    return (
      <div className="app">
        <SettingsForm
          defaultValues={this.state}
          submitCallback={this.handleNewGame}
          joinGame={this.handleJoinGame}
        />
        <br />
        <Game
          key={this.state.matchID}
          size={this.state.boardSize}
          game={this.state.game}
          joinGame={this.state.joinGame}
          renderInfo={true}
          web3={this.web3}
        />
      </div>
    )
  }
}
