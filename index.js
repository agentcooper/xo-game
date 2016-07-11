var XOGame = require('./XOGame');
var XOGameView = require('./XOGameView');

var game1 = new XOGame();
var view1 = new XOGameView(game1, document.querySelector('#canvas1'));
view1.setupEvents();

var game2 = new XOGame();
var view2 = new XOGameView(game2, document.querySelector('#canvas2'));
view2.setupEvents();