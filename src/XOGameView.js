var Board = require('./Board');
var loadImages = require('./loadImages');
var scaleImageSizes = require('./scaleImageSizes');

var C = require('./constants');

var cellSize = C.cellSize;
var CANVAS_WIDTH = C.CANVAS_WIDTH;
var CANVAS_HEIGHT = C.CANVAS_HEIGHT;
var X = C.X;
var O = C.O;

function XOGameView(game, canvas) {
  this.canvas = canvas;
  this.game = game;
  this.context = canvas.getContext('2d');
  this.highlightedCell = null;
}

XOGameView.prototype.setupEvents = function() {
  var canvas = this.canvas;
  var game = this.game;
  var context = this.context;

  canvas.addEventListener('mousemove', function(event) {
    var x = event.pageX - canvas.offsetLeft,
        y = event.pageY - canvas.offsetTop;

    var indeces = this.XYtoIndeces(x, y);

    if (this.isCoordOnBoard(x, y) && !game.board.get(indeces.row, indeces.column)) {
      this.highlightedCell = indeces;
    } else {
      this.highlightedCell = null;
    }

    this.renderGameToCanvas();

  }.bind(this));

  canvas.addEventListener('click', function(event) {
    var x = event.pageX - canvas.offsetLeft,
        y = event.pageY - canvas.offsetTop;

    if (game.winner || !game.isWinPossible()) {
      game.reset();
      this.renderGameToCanvas();
      return;
    }

    if (!this.isCoordOnBoard(x, y)) {
      return;
    }

    this.highlightedCell = null;

    var indeces = this.XYtoIndeces(x, y);

    if (!game.board.get(indeces.row, indeces.column)) {
      game.move(indeces.row, indeces.column);
    }

    this.renderGameToCanvas();
  }.bind(this));

  this.renderGameToCanvas();
}

XOGameView.prototype.drawGrid = function() {
  var context = this.context;
  var size = this.game.board.getSize();

  if (this.highlightedCell) {
    context.fillStyle = '#f5f5a4';
    context.fillRect(
      this.highlightedCell.column * cellSize,
      this.highlightedCell.row * cellSize,
      cellSize,
      cellSize
    );
  }

  for (var i = 1; i <= size; i++) {
    context.beginPath();
    context.moveTo(i * cellSize, 0);
    context.lineTo(i * cellSize, size * cellSize);
    context.stroke();

    context.beginPath();
    context.moveTo(0, i * cellSize);
    context.lineTo(size * cellSize, i * cellSize);
    context.stroke();
  }
}

XOGameView.prototype.renderGameToCanvas = function() {
  var context = this.context;
  var game = this.game;

  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  this.drawGrid();

  loadImages([ 'images/x.jpg', 'images/o.jpg' ], function(images) {
    var imageSizes = scaleImageSizes(images, cellSize);

    var shapeToImageName = {};
    shapeToImageName[X] = 'images/x.jpg';
    shapeToImageName[O] = 'images/o.jpg';

    game.board.rows.forEach(function(row, j) {
      row.forEach(function(value, i) {
        if (!value) {
          return;
        }

        var imageName = shapeToImageName[value];

        context.drawImage(images[imageName],
          (i * cellSize) + ((cellSize - imageSizes[imageName].width) / 2),
          (j * cellSize) + ((cellSize - imageSizes[imageName].height) / 2),
          imageSizes[imageName].width,
          imageSizes[imageName].height);
      });
    });
  });

  var message = '';

  if (game.winner) {
    message += game.turn + ' has won the game!';
  } else if (!game.isWinPossible()) {
    message += 'No possible winning combinations left.'
  } else {
    message += 'Current turn ' + game.turn;
  }

  context.font = '24px serif';
  context.fillStyle = 'black';
  context.fillText(message, game.board.getSize() * cellSize + 50, 100);

  if (game.winner || !game.isWinPossible()) {
    context.fillText('Click anywhere to start new game.',
      game.board.getSize() * cellSize + 50, 150);
  }
}

XOGameView.prototype.isCoordOnBoard = function(x, y) {
  var pixelSize = this.game.board.getSize() * cellSize;

  return x < pixelSize && y < pixelSize;
}

XOGameView.prototype.XYtoIndeces = function(x, y) {
  function getIndex(coord) {
    return Math.floor(coord / cellSize);
  }

  return {
    row: getIndex(y),
    column: getIndex(x),
  };
}

module.exports = XOGameView;