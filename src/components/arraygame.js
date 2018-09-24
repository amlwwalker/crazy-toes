var state = {
  board: [],
  wins: new Array(9),
  lastBoard: null,
  xIsNext: false,
  winner: null
}
var localWinStates = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

function checkForUltimateWinner(player) {
  for (var i = 0; i < 8; i++) {
    var stateA = localWinStates[i][0]
    var stateB = localWinStates[i][1]
    var stateC = localWinStates[i][2]
    if (
      state.wins[stateA] != undefined &&
      state.wins[stateA] == state.wins[stateB] &&
      state.wins[stateA] == state.wins[stateC]
    ) {
      // state.wins = player
      state.inPlay = false
      console.log("Ultimate Champion is " + player)
      return player
    }
  }
  return null
}
function checkForLocalWinner(outer, player) {
  //need to check if there is a match
  //accros any of the win combinations
  //from above
  for (var i = 0; i < 8; i++) {
    // console.log("i " + i + " : " + localWinStates[i])
    var stateA = localWinStates[i][0]
    var stateB = localWinStates[i][1]
    var stateC = localWinStates[i][2]
    // console.log(state.board[stateA][outer])
    // console.log(state.board[stateA][outer] == state.board[stateB][outer])

    // console.log(state.board[stateA][outer] == state.board[stateC][outer])
    if (
      state.board[stateA][outer] != undefined &&
      state.board[stateA][outer] == state.board[stateB][outer] &&
      state.board[stateA][outer] == state.board[stateC][outer]
    ) {
      state.wins[outer] = player
      console.log("game won by " + player)
      checkForUltimateWinner(player)
      return player
    }
  }
  return "0"
}
var counter = 0
function positionPiece(inner, outer, player) {
  //need to find the square the move was in
  // once you have the square, you can check for a local
  //win by using the standard win check
  //if there is a win, you can change to the win of the main board
  //BACKWARDS IN SOLIDITY REMMEBER!
  //outside the board
  console.log("move: " + inner + " " + outer)
  if (state.winner) {
    console.log("there is already a winner")
    return null
  }
  if (inner < 0 || outer < 0) {
    console.log("outside board")
    return null
  }
  //outside the board
  if (inner > 8 || outer > 8) {
    console.log("outside board")
    return null
  }
  if (state.lastBoard != null && outer != state.lastBoard) {
    console.log("invalid position")
    return
  }
  if (state.board[inner][outer] != null) {
    console.log("position taken")
    return
  }
  state.board[inner][outer] = player
  // console.log(state.board[inner][outer])
  //by choosing the next lastBoard, by the inner
  //coords are done for us
  state.lastBoard = inner
  checkForLocalWinner(outer, player)
}
function create2DArray(numRows, numColumns) {
  let array = new Array(numRows)

  for (let i = 0; i < numColumns; i++) {
    array[i] = new Array(numColumns)
  }

  return array
}
state.board = create2DArray(9, 9)
positionPiece(0, 0, "X")
positionPiece(2, 0, "O")
positionPiece(3, 2, "X")
positionPiece(2, 3, "O")
positionPiece(4, 2, "X")
positionPiece(2, 4, "O")
positionPiece(5, 2, "X")
positionPiece(1, 5, "O")
positionPiece(3, 1, "X")
positionPiece(1, 3, "O")
positionPiece(4, 1, "X")
positionPiece(1, 4, "O")
positionPiece(5, 1, "X")
positionPiece(0, 5, "O")
positionPiece(3, 0, "X")
positionPiece(0, 3, "O")
positionPiece(6, 0, "X")

// positionPiece(10, 11)
// console.log(state.board)
