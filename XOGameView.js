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
}

XOGameView.prototype.setupEvents = function() {
  var canvas = this.canvas;
  var game = this.game;

  canvas.addEventListener('click', function(event) {
    var x = event.pageX - canvas.offsetLeft,
        y = event.pageY - canvas.offsetTop;

    if (game.winner) {
      game.reset();
      this.renderGameToCanvas();
      return;
    }

    if (!this.isCoordOnBoard(x, y)) {
      return;
    }

    var indeces = this.XYtoIndeces(x, y);

    game.move(indeces.row, indeces.column);

    this.renderGameToCanvas();
  }.bind(this));

  this.renderGameToCanvas();
}

XOGameView.prototype.drawGrid = function() {
  var context = this.context;
  var size = this.game.board.getSize();

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

  loadImages([ 'x.jpg', 'o.jpg' ], function(images) {
    var imageSizes = scaleImageSizes(images, cellSize);

    var shapeToImageName = {};
    shapeToImageName[X] = 'x.jpg';
    shapeToImageName[O] = 'o.jpg';

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

  context.font = '24px serif';

  var message =
    game.winner ?
      game.turn + ' has won the game!'
      :
      'Current turn ' + game.turn;

  context.fillText(message, game.board.getSize() * cellSize + 50, 100);

  if (game.winner) {
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