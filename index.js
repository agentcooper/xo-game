var Board = require('./Board');
var XOGame = require('./XOGame');
var C = require('./constants');

var cellSize = C.cellSize;
var CANVAS_WIDTH = C.CANVAS_WIDTH;
var CANVAS_HEIGHT = C.CANVAS_HEIGHT;
var X = C.X;
var O = C.O;


function loadImages(images, callback) {
  var result = {};

  images.forEach(function(src) {
    var image = new Image();
    image.src = src;

    image.onload = function() {
      result[src] = image;

      if (Object.keys(result).length === images.length) {
        callback(result);
      }
    }
  });
}

function scaleImageSizes(images) {
  var margin = 5;

  var imageSizes = Object.keys(images).reduce(function(result, imageName) {
    var w = images[imageName].width;
    var h = images[imageName].height;
    var widthToHeight = w / h;

    result[imageName] =
      w >= h ?
        {
          width: cellSize - margin * 2,
          height: (cellSize - margin * 2) * widthToHeight
        }
        :
        {
          width: (cellSize - margin * 2) * widthToHeight,
          height: cellSize - margin * 2
        }

    return result;
  }, {});

  return imageSizes;
}

function drawGrid(game, context) {
  var size = game.board.getSize();

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

function renderGameToCanvas(game, canvas) {
  var context = canvas.getContext('2d');

  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawGrid(game, context);

  loadImages([ 'x.jpg', 'o.jpg' ], function(images) {
    var imageSizes = scaleImageSizes(images);

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
  // context.textAlign = 'center';

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

var game = new XOGame();

function isCoordOnBoard(game, x, y) {
  var pixelSize = game.board.getSize() * cellSize;

  return x < pixelSize && y < pixelSize;
}

function XYtoIndeces(game, x, y) {

  function getIndex(coord) {
    return Math.floor(coord / cellSize);
  }

  return {
    row: getIndex(y),
    column: getIndex(x),
  };
}

var canvas = document.querySelector('#canvas');

canvas.addEventListener('click', function(event) {
  var x = event.pageX - canvas.offsetLeft,
      y = event.pageY - canvas.offsetTop;

  if (game.winner) {
    game.reset();
    renderGameToCanvas(game, canvas);
    return;
  }

  if (!isCoordOnBoard(game, x, y)) {
    return;
  }

  var indeces = XYtoIndeces(game, x, y);

  game.move(indeces.row, indeces.column);

  renderGameToCanvas(game, canvas);
});

renderGameToCanvas(game, canvas);
