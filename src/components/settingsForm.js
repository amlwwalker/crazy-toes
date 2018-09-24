import React from "react"

class SettingsForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      boardSize: this.props.defaultValues.boardSize,
      joinGame: false,
      game: this.props.game
    }
  }

  handleChange = event => {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }
  handleJoinExistingGame = event => {
    const target = event.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value
    })
    console.log("setting sate " + name + " to " + this.state.game)
  }
  handleJoinGame = event => {
    this.props.joinGame(this.state.game)
    event.preventDefault()
  }
  handleNewGame = event => {
    this.props.submitCallback()
    event.preventDefault()
  }

  render() {
    return (
      <div>
        <button onClick={this.handleNewGame}>New Game</button>
        <label className="settings-label">
          {/* Board size{" "}
          <input
            name="boardSize"
            type="number"
            min="2"
            max="10"
            value={this.state.boardSize}
            onChange={this.handleChange}
          /> */}
        </label>
        <label className="settings-label">
          Join Game{" "}
          <input
            name="joinGame"
            type="checkbox"
            checked={this.state.joinGame}
            onChange={this.handleChange}
          />
        </label>
        {this.state.joinGame && (
          <div>
            <label className="settings-label">
              Game ID{" "}
              <input
                name="game"
                type="number"
                min="1"
                value={this.state.game}
                onChange={this.handleChange}
              />
            </label>
            <button onClick={this.handleJoinGame}>Join game</button>
          </div>
        )}
        <label className="settings-label">
          Join Existing Game{" "}
          <input
            name="game"
            type="number"
            min="1"
            value={this.state.game}
            onChange={this.handleChange}
          />
        </label>
        <button onClick={this.handleJoinExistingGame}>
          Join Existing Game
        </button>
      </div>
    )
  }
}

export default SettingsForm
