var X = 'x';
var O = 'o';
var cellSize = 100;

var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 400;

function Board(n) {
  this.rows =
    Array.from({ length: n })
      .map(function(row) {
        return Array.from({ length: n })
      });
}

Board.prototype.getSize = function() {
  return this.rows.length;
}

Board.prototype.set = function(x, y, value) {
  this.rows[x][y] = value;
};

Board.prototype.get = function(x, y) {
  return this.rows[x][y];
};

Board.prototype.toString = function() {
  return this.rows.map(function(row) {
    return row.join(' ');
  }).join('\n');
};

Board.prototype.getRows = function() {
  return this.rows;
};

Board.prototype.getColumns = function() {
  var columns = [];

  for (var i = 0; i < this.rows.length; i++) {
    var column = [];

    for (var j = 0; j < this.rows.length; j++) {
      column.push(this.rows[j][i]);
    }

    columns.push(column);
  }

  return columns;
};

Board.prototype.getDiagonals = function() {
  var mainDiagonal = [];
  for (var i = 0; i < this.rows.length; i++) {
    mainDiagonal.push(this.rows[i][i]);
  }

  var backDiagonal = [];
  for (var i = 0; i < this.rows.length; i++) {
    backDiagonal.push(this.rows[i][this.rows.length - i - 1]);
  }

  return [mainDiagonal, backDiagonal];
};

function XOGame() {
  this.board = new Board(4);

  this.turn = 'player1';

  this.winner = '';

  this.players = ['player1', 'player2'];
}

XOGame.prototype.move = function(x, y) {
  var playerToShape = {
    'player1': X,
    'player2': O
  };

  this.board.set(x, y, playerToShape[this.turn]);

  this.winner = this.getWinner();

  if (!this.winner) {
    this.setTurn(this.nextPlayerName());
  }
};

XOGame.prototype.nextPlayerName = function() {
  var that = this;

  return this.players.find(function(player) { return player !== that.turn });
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

XOGame.prototype.checkIsWinner = function(who) {
  return this.getValidLines().some(function(line) {
    return line.every(function(value) {
      return value === who;
    });
  });
};

XOGame.prototype.getWinner = function() {
  if (this.checkIsWinner(X)) {
    return X;
  }

  if (this.checkIsWinner(O)) {
    return O;
  }

  return null;
};

XOGame.prototype.setTurn = function(playerName) {
  this.turn = playerName;
}

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

  var message =
    game.winner ?
      game.turn + ' has won the game!'
      :
      'Current turn ' + game.turn;

  context.fillText(message, game.board.getSize() * cellSize + 50, 100);
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

  if (!isCoordOnBoard(game, x, y)) {
    return;
  }

  var indeces = XYtoIndeces(game, x, y);

  game.move(indeces.row, indeces.column);

  renderGameToCanvas(game, canvas);
});

renderGameToCanvas(game, canvas);
