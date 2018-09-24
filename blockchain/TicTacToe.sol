pragma solidity ^0.4.24;

contract TicTacToe {
 uint8[][] _winStates = [[0,1,2],[3,4,5],[6,7,8], [0,3,6],[1,4,7],[2,5,8], [0,4,8],[2,4,6]];
  //this should own the games and their states between players
  //it should escrow the funds for the game
  //distribute funds to winners
  //manage erc721 ownership of trophies

  //member variables required
  //a new games is started between two players
  //a time limit exists on a game (in days). The last player to move would win if it ends
  //an amount of money is escrowed for the game
  //players have a window to escrow money or they forefeit score
  
  //map (player -> current game ID)
  //map (current game ID -> amount of money in play)
  //map (current game ID -> game state)
  //map (player -> O or X)
  event Claim(address indexed payee, uint256 amount);

  struct Move {
    uint8 row;
    uint8 col;
    uint8 outerRow;
    uint8 outerCol;
  }
  struct Lines {
    uint8[] row;
    uint8[] col;
    uint8[] diag;
    uint8[] antidiag;
    uint8 length;
  }
  struct Game {
    uint256 id;
    uint256 rate;
    uint256 endTime;
    address challenger;
    address accepter;
    address toPlay;
    address winner;
    address[] board;
    bool inPlay;
  }
  uint256 royalty;
  mapping(uint256 => Game) games;
  mapping(address => uint256) public userGames;
  uint256 gameCount;

  constructor(uint256 _royalty) public {
    require(_royalty > 0, "increase the royalty");
    royalty = _royalty;
  }
  function createGame(uint256 rate, uint256 endTime) public returns (uint256){
    require(userGames[msg.sender] == 0, "player cannot play multiple games at once"); //player cannot play multiple games at once
    address[] memory board = new address[](9);
    uint256 id = ++gameCount;
    Game memory g = Game(
      {
      id: id,
      rate: rate,
      endTime: endTime,
      challenger: msg.sender,
      accepter: address(0),
      winner: address(0),
      toPlay: address(0),
      board: board,
      inPlay: false
      }
    );
    games[id] = g;
    userGames[msg.sender] = id;
    //emit an event
  }
  function getGameBoard(uint256 id) public returns (address[]) {
    return games[id].board;
  }
  function joinGame(uint256 id) public payable {
    require(userGames[msg.sender] == 0, "player cannot play multiple games at once"); //player cannot play multiple games at once
    require(games[id].inPlay == true, "game in play");
    require(games[id].accepter == address(0), "Game in progress");
    require(games[id].challenger != msg.sender, "you cannot play yourself");
    
    userGames[msg.sender] = id;
    games[id].accepter = msg.sender;
    games[id].toPlay = msg.sender;
    games[id].inPlay = true;
    //make the first move
    //emit an event
  }
  function move(uint256 id, uint8 position) public returns (address[]) {
    require(games[id].winner == address(0), "game already has a winner");
    require(games[id].challenger == msg.sender || games[id].accepter == msg.sender, "Invalid player");
    require(games[id].toPlay == msg.sender, "it is not your turn");
    require(position >= 0 || position < 9, "not on the board");
    require(games[id].board[position] == address(0), "already occupied");
    //update the position on the board as owned by the sender
    games[id].board[position] = msg.sender;
    if (games[id].toPlay == games[id].challenger) {
      games[id].toPlay = games[id].accepter;
    } else {
      games[id].toPlay = games[id].challenger;
    }
    testForWinner(id);
    return games[id].board; //returns the new board
    //emit the position the player went in (or something)
    //Emit(position, sender)
  }

  function handleMove(Move lastMove) {
    calculateWinner();
    return;
  }
  
  function calculateWinner(Move lastMove) internal {
      //check if there is a valid last move object
      //check that the row and col are not null
    uint8 size = 3;
    uint8 x = lastMove.row;
    uint8 y = lastMove.col;
    //check if the square underneath is null
    // uint8 lastPayer = games[i].board[x * size + y];
    Lines memory lines = Lines({
      row:new uint8[](9),
      col:new uint8[](9),
      diag:new uint8[](9),
      antidiag:new uint8[](9),
      length: 3
    });
    // Row
    uint8 i = 0;
    for (i = 0; i < lines.length; i++) {
      lines.row[i] = (x * size + i);
      lines.length++; //set the length
    }
    // Col
    for (i = 0; i < size; i++) {
      lines.col[i] = (i * size + y);
    }
   // Diagonal
    if (x == y) {
      for (i = 0; i < size; i++) {
        lines.diag[i] = (i * size + i);
      }
    }
    // Anti-diagonal
    if (x + y == size - 1) {
      for (i = 0; i < size; i++) {
        lines.antidiag[i] = (i * size + size - 1 - i);
      }
    }
    uint8[] memory prop = lines.row;
      // const result = line.reduce(
      //   (acc, index) => acc && squares[index] === lastPlayer,
      //   true
      // )
      // if (result) {
      //   return line
      // }
    // }
  }
  //if there is a winner they should be paid the money stored in escrow
  //minus fees etc
  function testForWinner(uint256 id) public returns (address) {
    for (uint8 i = 0; i < 9; i++) {
      uint8 a = _winStates[i][0];
      uint8 b = _winStates[i][1];
      uint8 c = _winStates[i][2];
      address[] memory board = games[i].board;
      if (board[a] != address(0) && board[a] == board[b] && board[a] == board[c]) {
        //we have a winner
        games[i].inPlay = false;
        games[i].winner = board[a]; //set the winner
        //emit a win event
        return board[a];
      }
    }
    return address(0);
  }
  function payOut(uint256 id) public {
    require(games[id].challenger == msg.sender || games[id].accepter == msg.sender, "Invalid player");
    address winner = testForWinner(id);
    if (winner != address(0)) {//so there is a winner
      //finalize and pay the winner...
    }
    //emit a signal that someone one
  }
}