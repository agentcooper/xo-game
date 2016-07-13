const Board = require('./Board'),
      { X, O } = require('./constants');

class XOGame {
  constructor(size) {
    this.board = new Board(size);

    this.turn = 'player1';

    this.winner = '';

    this.players = ['player1', 'player2'];

    this.playerToShape = {
      'player1': X,
      'player2': O
    };
  }

  move(x, y) {
    this.board.setValue(x, y, this.playerToShape[this.turn]);

    this.winner = this.getWinner();

    if (!this.winner) {
      this.setTurn(this.nextPlayerName(this.turn));
    }
  }

  nextPlayerName(currentPlayerName) {
    return this.players.find(player => player !== currentPlayerName);
  }

  toString() {
    return this.board.toString();
  }

  getValidLines() {
    return [
      ...this.board.getRows(),
      ...this.board.getColumns(),
      ...this.board.getDiagonals()
    ];
  }

  isWinPossible() {
    function isWinPossibleInLine(line, shape) {
      return line.every(value => value === undefined || value === shape);
    }

    return this.getValidLines().some(
      line => isWinPossibleInLine(line, X) || isWinPossibleInLine(line, O)
    );
  }

  checkIsWinner(playerName) {
    return this.getValidLines().some(function(line) {
      return line.every(value => value === this.playerToShape[playerName]);
    }, this);
  }

  getWinner() {
    return this.players.find(player => this.checkIsWinner(player)) || '';
  }

  setTurn(playerName) {
    this.turn = playerName;
  }

  reset() {
    this.board = new Board(this.board.getSize());
    this.turn = this.nextPlayerName(this.winner);
    this.winner = '';
  }
}

module.exports = XOGame;
