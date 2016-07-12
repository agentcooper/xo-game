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

module.exports = Board;
