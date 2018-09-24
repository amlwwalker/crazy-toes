import React from "react"
import Board from "./board.js"
import { makeMove } from "./web3/contract"
import generateGridNxN from "./utils.js"

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      squares: Array(this.props.size * this.props.size).fill(
        // Outer squares
        Array(this.props.size * this.props.size).fill(null)
      ), // Inner squares
      localWinners: Array(this.props.size * this.props.size).fill(null),
      lastMoveLocation: {
        row: null,
        col: null,
        outerRow: null,
        outerCol: null
      },
      xIsNext: true,
      winner: null
    }

    this.timeOver = this.timeOver.bind(this)
    this.renderBoard = this.renderBoard.bind(this)
  }

  timeOver(player) {
    // console.log('Time over!!' + player + ' loses');
    if (player === "X") {
      this.setState({ winner: "O" })
    } else {
      this.setState({ winner: "X" })
    }
  }

  isCurrentBoard(idx) {
    if (this.state.winner) return false

    const lastRow = this.state.lastMoveLocation.row
    const lastCol = this.state.lastMoveLocation.col
    if (lastRow === null || lastCol === null) {
      return true
    } else {
      const currentBoard = lastRow * this.props.size + lastCol
      if (this.state.localWinners[currentBoard]) {
        return this.state.localWinners[idx] === null
      } else {
        return idx === currentBoard
      }
    }
  }

  async makeMove(inner_idx, outer_idx) {
    const { game: gameId } = this.props
    console.log("game id " + gameId)
    try {
      const response = await makeMove(gameId, inner_idx, outer_idx)
      return response
    } catch (error) {
      console.log("making move threw an error ", error)
      return null
    }
  }
  handleClick = async (inner_idx, outer_idx) => {
    const size = this.props.size
    console.log(this.state.squares)
    var outerSquares = this.state.squares.slice()
    console.log(" os ", outerSquares)
    var squares = this.state.squares[outer_idx].slice()
    var localWinners = this.state.localWinners.slice()
    if (
      this.state.winner ||
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
    //TODO: This is off just for frontend dev
    // const response = await this.makeMove(inner_idx, outer_idx)
    // console.log("make move: ", response)
    // if (response == null) {
    //   return
    // }
    console.log("inner_idx " + inner_idx + " outer_idx " + outer_idx)
    console.log("lastMoveLocation: ", lastMoveLocation)
    squares[inner_idx] = this.state.xIsNext ? "X" : "O"
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
    this.setState((prevState, props) => ({
      squares: outerSquares,
      localWinners: localWinners,
      lastMoveLocation: lastMoveLocation,
      xIsNext: !this.state.xIsNext,
      winner: winner
    }))
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
        size={this.props.size}
        squares={this.state.squares[i]}
        winner={this.state.localWinners[i]}
        clickable={this.isCurrentBoard(i)}
        onClick={p => this.handleClick(p, i)}
      />
    )
  }

  render() {
    let status
    if (this.state.winner) {
      status = this.state.winner + " wins!"
      const lastOuterMove = {
        row: this.state.lastMoveLocation.outerRow,
        col: this.state.lastMoveLocation.outerCol
      }
      if (
        this.calculateWinner(this.state.localWinners, lastOuterMove) === null
      ) {
        status = "Time over! " + status
      }
    } else {
      if (this.state.localWinners.indexOf(null) === -1) {
        status = "Draw! Everybody wins!! :D"
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O")
      }
    }

    const timerXPaused = !this.state.xIsNext || Boolean(this.state.winner)
    const timerOPaused = this.state.xIsNext || Boolean(this.state.winner)
    const grid = generateGridNxN("game", this.props.size, this.renderBoard)
    return (
      <div className="game-container">
        {grid}
        {this.props.renderInfo && (
          <div className="game-info">
            <div>{status}</div>
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
export default Game
