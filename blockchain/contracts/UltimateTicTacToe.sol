pragma solidity ^0.4.24;

contract UltimateTicTacToe {
  uint8[][] localWinStates = [[0,1,2],[3,4,5],[6,7,8], [0,3,6],[1,4,7],[2,5,8], [0,4,8],[2,4,6]];
  uint256 gameCount;
  event Claim(address indexed payee, uint256 amount);
  struct Game {
    uint256 id;
    address[9][9] board;
    address[9] localWins;
    uint8 lastBoard;
    address toPlay;
    address winner;
    address challenger;
    address accepter;
    bool inPlay;
    bool created;
  }
  mapping(address => uint256) public userGames;
  mapping(uint256 => Game) public games;
  //need an index of games in play
  //so that can list them on the frontend
  uint256[] gamesInPlay;
  uint8 initialStartBoard = 100;

  constructor(uint256 _royalty) public {
    // require(_royalty > 0, "increase the royalty");
    // royalty = _royalty;
  }
  function createGame(uint256 rate) public {
    require(userGames[msg.sender] == 0, "cannot be in multiple games at once");
    address[9][9] memory board;
    address[9] memory wins;
    uint256 id = ++gameCount;
    Game memory g = Game(
      {
      id: id,
      board: board,
      localWins: wins,
      lastBoard: initialStartBoard,
      winner: address(0),
      challenger: msg.sender,
      accepter: address(0),
      toPlay: address(0),
      inPlay: false,
      created: true
      }
    );
    games[id] = g;
    gamesInPlay.push(id);
    userGames[msg.sender] = id;
    //emit an event
  }
  function removeGameFromPlay(uint256 index) internal returns(uint256[]) {
    if (index >= gamesInPlay.length) return;
    gamesInPlay[index] = gamesInPlay[gamesInPlay.length-1];
    delete gamesInPlay[gamesInPlay.length-1];
    gamesInPlay.length--;
    return gamesInPlay;
  }
  function getGameBoard(uint256 id) public returns (address[9][9]) {
    return games[id].board;
  }
  function joinGame(uint256 id) public {
    //double check probably unecessary
    require(id <= gameCount, "game has not been created yet");
    require(games[id].created == true, "game has not been created yet");
    require(userGames[msg.sender] == 0, "cannot be in multiple games at once");
    // require(msg.sender != games[id].challenger, "cannot play yourself");
    require(games[id].inPlay != true,"the game is in play");
    require(games[id].winner == address(0), "this games has been completed");
    userGames[msg.sender] = id;
    games[id].accepter = msg.sender;
    games[id].toPlay = msg.sender;
    games[id].inPlay = true;
  }

  function makeMove(uint8 id, uint8 inner, uint8 outer) public returns (bool){
    require(games[id].challenger == msg.sender || games[id].accepter == msg.sender, "not valid player");
    require(games[id].winner == address(0), "game has already been won");
    require(games[id].toPlay == msg.sender, "it is not your turn ");

    require(inner >= 0 || outer >= 0, "not on the board");
    require(inner < 9 || outer < 9, "not on the board");
    require(games[id].board[inner][outer] == address(0), "already occupied");
    require(games[id].lastBoard == initialStartBoard || outer == games[id].lastBoard, "playing in the wrong board");

    //are you actuall part of this game to make a move....

    // if (games[id].lastBoard != initialStartBoard && outer != games[id].lastBoard) {
    //   return false;
    // }
    // if (games[id].board[inner][outer] != address(0)) {
    //   return false;
    // }

    address player = msg.sender;
    games[id].board[inner][outer] = player;
    games[id].lastBoard = inner;
    //flip the players over
    if (games[id].toPlay == games[id].challenger) {
      games[id].toPlay = games[id].accepter;
    } else {
      games[id].toPlay = games[id].challenger;
    }
    checkForLocalWinner(id, outer, player);
    return true;
  }
  function checkForLocalWinner(uint8 id, uint8 outer, address player) internal returns (address) {
    for (uint8 i = 0; i < 8; i++) {
      uint8 stateA = localWinStates[i][0];
      uint8 stateB = localWinStates[i][1];
      uint8 stateC = localWinStates[i][2];

      if (games[id].board[stateA][outer] != address(0)
      && games[id].board[stateA][outer] == games[id].board[stateB][outer] && 
      games[id].board[stateA][outer] == games[id].board[stateC][outer]) {
        games[id].localWins[outer] = player;
        checkForUltimateWinner(id, player);
        return player;
      }
    }
  }
  function checkForUltimateWinner(uint8 id, address player) internal returns (address) {
    for (uint8 i = 0; i < 8; i++) {
      uint8 stateA = localWinStates[i][0];
      uint8 stateB = localWinStates[i][1];
      uint8 stateC = localWinStates[i][2];
      if (games[id].localWins[stateA] != address(0)
      && games[id].localWins[stateA] == games[id].localWins[stateB] && 
      games[id].localWins[stateA] == games[id].localWins[stateC]) {
        games[id].inPlay = false;
        games[id].winner = player;
        removeGameFromPlay(id);
        return player;
      }
    }
    return address(0);
  }
}