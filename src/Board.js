class Board {
  constructor(size) {
    this.rows =
      Array.from({ length: size })
        .map(function(row) {
          return Array.from({ length: size })
        });
  }

  getSize() {
    return this.rows.length;
  }

  setValue(x, y, value) {
    this.rows[x][y] = value;
  }

  getValue(x, y) {
    return this.rows[x] ? this.rows[x][y] : undefined;
  }

  toString() {
    return this.rows.map(row => row.join(' ')).join('\n');
  }

  getRows() {
    return this.rows;
  }

  getColumns() {
    let columns = [];

    for (let i = 0; i < this.rows.length; i++) {
      const column = [];

      for (let j = 0; j < this.rows.length; j++) {
        column.push(this.rows[j][i]);
      }

      columns.push(column);
    }

    return columns;
  }

  getDiagonals() {
    const mainDiagonal = [];
    for (let i = 0; i < this.rows.length; i++) {
      mainDiagonal.push(this.rows[i][i]);
    }

    const backDiagonal = [];
    for (let i = 0; i < this.rows.length; i++) {
      backDiagonal.push(this.rows[i][this.rows.length - i - 1]);
    }

    return [mainDiagonal, backDiagonal];
  }
}


module.exports = Board;
