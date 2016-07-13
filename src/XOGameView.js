const Board = require('./Board'),
      loadImages = require('./loadImages'),
      scaleImageSizes = require('./scaleImageSizes');

const { cellSize, CANVAS_WIDTH, CANVAS_HEIGHT, X, O } = require('./constants');

class XOGameView {
  constructor(game, canvas) {
    this.canvas = canvas;

    this.game = game;

    this.context = canvas.getContext('2d');

    this.highlightedCell = null;

    this.images = null;
  }

  setupEvents() {
    const canvas = this.canvas,
          game = this.game,
          context = this.context;

    document.body.addEventListener('mousemove', function(event) {
      const x = event.pageX - canvas.offsetLeft,
            y = event.pageY - canvas.offsetTop;

      const indeces = this.XYtoIndeces(x, y);

      if (this.isCoordOnBoard(x, y) && !game.board.getValue(indeces.row, indeces.column)) {
        this.highlightedCell = indeces;
      } else {
        this.highlightedCell = null;
      }
      
      this.renderGameToCanvas();

    }.bind(this));

    canvas.addEventListener('click', function(event) {
      const x = event.pageX - canvas.offsetLeft,
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

      const indeces = this.XYtoIndeces(x, y);

      if (!game.board.getValue(indeces.row, indeces.column)) {
        game.move(indeces.row, indeces.column);
      }

      this.renderGameToCanvas();
    }.bind(this));

    this.renderGameToCanvas();
  }

  drawGrid() {
    const context = this.context,
          size = this.game.board.getSize();

    if (this.highlightedCell) {
      context.fillStyle = '#f5f5a4';
      context.fillRect(
        this.highlightedCell.column * cellSize,
        this.highlightedCell.row * cellSize,
        cellSize,
        cellSize
      );
    }

    for (let i = 1; i <= size; i++) {
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

  renderGameToCanvas() {
    const context = this.context,
          game = this.game;

    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    this.drawGrid();

    loadImages([ 'images/x.jpg', 'images/o.jpg' ], function(images) {
      const imageSizes = scaleImageSizes(images, cellSize);

      const shapeToImageName = {};
      shapeToImageName[X] = 'images/x.jpg';
      shapeToImageName[O] = 'images/o.jpg';

      game.board.rows.forEach((row, j) => {
        row.forEach((value, i) => {
          if (!value) {
            return;
          }

          const imageName = shapeToImageName[value];

          context.drawImage(images[imageName],
            (i * cellSize) + ((cellSize - imageSizes[imageName].width) / 2),
            (j * cellSize) + ((cellSize - imageSizes[imageName].height) / 2),
            imageSizes[imageName].width,
            imageSizes[imageName].height);
        });
      });
    });

    let message = '';

    if (game.winner) {
      message += `${game.turn} has won the game!`;
    } else if (!game.isWinPossible()) {
      message += `No possible winning combinations left.`;
    } else {
      message += `Current turn ${game.turn}`;
    }

    context.font = '24px serif';
    context.fillStyle = 'black';
    context.fillText(message, game.board.getSize() * cellSize + 50, 100);

    if (game.winner || !game.isWinPossible()) {
      context.fillText('Click anywhere to start new game.',
        game.board.getSize() * cellSize + 50, 150);
    }
  }

  isCoordOnBoard(x, y) {
    const pixelSize = this.game.board.getSize() * cellSize;

    return x < pixelSize && y < pixelSize;
  }

  XYtoIndeces(x, y) {
    function getIndex(coord) {
      return Math.floor(coord / cellSize);
    }

    return {
      row: getIndex(y),
      column: getIndex(x),
    };
  }

}

module.exports = XOGameView;
