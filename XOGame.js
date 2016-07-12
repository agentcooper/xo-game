var Board = require('./Board');
var C = require('./constants');

var X = C.X;
var O = C.O;

function XOGame(size) {
  this.board = new Board(size);

  this.turn = 'player1';

  this.winner = '';

  this.players = ['player1', 'player2'];

  this.playerToShape = {
    'player1': X,
    'player2': O
  };
}

XOGame.prototype.move = function(x, y) {
  this.board.set(x, y, this.playerToShape[this.turn]);

  this.winner = this.getWinner();

  if (!this.winner) {
    this.setTurn(this.nextPlayerName(this.turn));
  }
};

XOGame.prototype.nextPlayerName = function(currentPlayerName) {
  return this.players.find(function(player) { return player !== currentPlayerName });
};

XOGame.prototype.toString = function() {
  return this.board.toString();
};

XOGame.prototype.getValidLines = function() {
  return []
    .concat(this.board.getRows())
    .concat(this.board.getColumns())
    .concat(this.board.getDiagonals());
}

XOGame.prototype.isWinPossible = function() {
  function isWinPossibleInLine(line, shape) {
    return line.every(function(value) {
      return value === undefined || value === shape;
    });
  }

  return this.getValidLines().some(function(line) {
    return isWinPossibleInLine(line, X) || isWinPossibleInLine(line, O);
  });
}

XOGame.prototype.checkIsWinner = function(playerName) {
  return this.getValidLines().some(function(line) {
    return line.every(function(value) {
      return value === this.playerToShape[playerName];
    }, this);
  }, this);
};

XOGame.prototype.getWinner = function() {
  return this.players.find(function(player) {
    return this.checkIsWinner(player);
  }, this) || '';
};

XOGame.prototype.setTurn = function(playerName) {
  this.turn = playerName;
}

XOGame.prototype.reset = function() {
  this.board = new Board(this.board.getSize());
  this.turn = this.nextPlayerName(this.winner);
  this.winner = '';
}

module.exports = XOGame;
