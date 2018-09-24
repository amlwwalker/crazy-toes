import React from "react"
import { connect } from "react-redux"
import Board from "./board.js"
import generateGridNxN from "./utils.js"

class Game extends React.Component {
  constructor(props) {
    super(props)

    this.timeOver = this.timeOver.bind(this)
    this.renderBoard = this.renderBoard.bind(this)
  }

  timeOver(player) {
    // console.log('Time over!!' + player + ' loses');
    if (player === "X") {
      this.props.updateGame({ winner: "O" })
    } else {
      this.props.updateGame({ winner: "X" })
    }
  }

  isCurrentBoard(idx) {
    console.log("checking " + idx)
    console.log("the last resort " + this.props.game.winner)
    if (this.props.game.winner) return false
    console.log("but it never makes it ehre....")
    const lastRow = this.props.game.lastMoveLocation.row
    const lastCol = this.props.game.lastMoveLocation.col
    if (lastRow === null || lastCol === null) {
      console.log("lost")
      console.log("it is the current board")
      return true
    } else {
      const currentBoard = lastRow * this.props.game.size + lastCol
      if (this.props.game.localWinners[currentBoard]) {
        console.log("lost 1")
        console.log(
          "local winners = " + this.props.game.localWinners[idx] === null
        )
        return this.props.game.localWinners[idx] === null
      } else {
        console.log("lost 2")
        console.log(
          "idx === currentBoard = ",
          currentBoard,
          " ",
          idx === currentBoard
        )
        return idx === currentBoard
      }
    }
  }

  handleClick = async (inner_idx, outer_idx) => {
    const size = this.props.game.size
    console.log("game at beginning of click ", this.props.game)
    var outerSquares = this.props.game.squares.slice()
    var squares = this.props.game.squares[outer_idx].slice()
    console.log(" squares[inner_idx] ", squares[inner_idx])
    var localWinners = this.props.game.localWinners.slice()
    console.log("this.props.game.winner = " + this.props.game.winner)
    if (
      this.props.game.winner ||
      !this.isCurrentBoard(outer_idx) ||
      squares[inner_idx]
    ) {
      return
    }
    const lastMoveLocation = {
      row: Math.floor(inner_idx / size),
      //this is clever
      //modulo of a number below the mod, is itself...
      col: inner_idx % size,
      outerRow: Math.floor(outer_idx / size),
      outerCol: outer_idx % size
    }
    //lets send the request to the blockchain
    const response = await this.props.makeMove(inner_idx, outer_idx)
    console.log("make move: ", response)
    this.props.updateGame({ errorMessage: response })
    // this.setState((prevState, props) => ({
    //   errorMessage: response
    // }))
    if (response != null) {
      return
    }
    console.log("inner_idx " + inner_idx + " outer_idx " + outer_idx)
    console.log("lastMoveLocation: ", lastMoveLocation)
    squares[inner_idx] = this.props.game.xIsNext ? "X" : "O"
    outerSquares[outer_idx] = squares
    //inner index tells you the coordinates within a smaller game
    //outer index tells you the coordinates within the overall board
    const newWinnerLine = this.calculateWinner(squares, lastMoveLocation)
    localWinners[outer_idx] = newWinnerLine && squares[newWinnerLine[0]]
    const globalWinnerLine = this.calculateWinner(localWinners, {
      row: lastMoveLocation.outerRow,
      col: lastMoveLocation.outerCol
    })
    const winner = globalWinnerLine ? localWinners[globalWinnerLine[0]] : null
    console.log("game before ", this.props.game)
    await this.props.updateGame({
      squares: outerSquares,
      localWinners: localWinners,
      lastMoveLocation: lastMoveLocation,
      xIsNext: !this.props.game.xIsNext,
      winner: winner
    })
    console.log("game after ", this.props.game)
    // this.setState((prevState, props) => ({}))
  }

  calculateWinner(squares, lastMoveLocation) {
    if (
      !lastMoveLocation ||
      lastMoveLocation.row === null ||
      lastMoveLocation.col === null
    )
      return null

    const size = Math.sqrt(squares.length)
    console.log(squares.length, size)
    const x = lastMoveLocation.row
    const y = lastMoveLocation.col
    const lastPlayer = squares[x * size + y]
    if (lastPlayer === null) return null

    // Generate possible winner lines for last move
    var lines = { row: [], col: [], diag: [], antidiag: [] }
    // Row
    for (let i = 0; i < size; i++) {
      lines.row.push(x * size + i)
    }
    // Col
    for (let i = 0; i < size; i++) {
      lines.col.push(i * size + y)
    }
    // Diagonal
    if (x === y) {
      for (let i = 0; i < size; i++) {
        lines.diag.push(i * size + i)
      }
    }
    // Anti-diagonal
    if (x + y === size - 1) {
      for (let i = 0; i < size; i++) {
        lines.antidiag.push(i * size + size - 1 - i)
      }
    }

    console.log(lines)
    // Chech values on each candidate line
    for (let prop in lines) {
      const line = lines[prop]
      if (line.length !== size) continue
      const result = line.reduce(
        (acc, index) => acc && squares[index] === lastPlayer,
        true
      )
      if (result) {
        return line
      }
    }
    return null
  }

  renderBoard(i) {
    return (
      <Board
        key={i}
        size={this.props.game.size}
        squares={this.props.game.squares[i]}
        winner={this.props.game.localWinners[i]}
        clickable={this.isCurrentBoard(i)}
        onClick={p => this.handleClick(p, i)}
      />
    )
  }

  render() {
    let status
    if (this.props.game.winner) {
      status = this.props.game.winner + " wins!"
      const lastOuterMove = {
        row: this.props.game.lastMoveLocation.outerRow,
        col: this.props.game.lastMoveLocation.outerCol
      }
      if (
        this.calculateWinner(this.props.game.localWinners, lastOuterMove) ===
        null
      ) {
        status = "Time over! " + status
      }
    } else {
      if (this.props.game.localWinners.indexOf(null) === -1) {
        status = "Draw! Everybody wins!! :D"
      } else {
        status = "Next player: " + (this.props.game.xIsNext ? "X" : "O")
      }
    }

    const timerXPaused =
      !this.props.game.xIsNext || Boolean(this.props.game.winner)
    const timerOPaused =
      this.props.game.xIsNext || Boolean(this.props.game.winner)
    const grid = generateGridNxN("game", this.props.game.size, this.renderBoard)
    return (
      <div className="game-container">
        {grid}
        {this.props.renderInfo && (
          <div className="game-info">
            <div>{status}</div>
            <div>{this.props.game.errorMessage}</div>
            {/* {this.props.clock && (
              <div>
                [TIME] X:{" "}
                <CountDown
                  key={1}
                  player="X"
                  seconds={this.props.time * 60}
                  isPaused={timerXPaused}
                  timeOverCallback={this.timeOver}
                />
                , O:{" "}
                <CountDown
                  key={2}
                  player="O"
                  seconds={this.props.time * 60}
                  isPaused={timerOPaused}
                  timeOverCallback={this.timeOver}
                />
              </div>
            )} */}
          </div>
        )}
      </div>
    )
  }
}
const mapState = ({ game }) => ({ game })
const mapDispatch = ({ game }) => ({
  makeMove: game.makeMove,
  updateGame: game.updateGame
})
export default connect(
  mapState,
  mapDispatch
)(Game)
