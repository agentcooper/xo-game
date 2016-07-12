var XOGame = require('./XOGame');
var XOGameView = require('./XOGameView');

var game1 = new XOGame(4);
var view1 = new XOGameView(game1, document.querySelector('#canvas1'));
view1.setupEvents();

var game2 = new XOGame(3);
var view2 = new XOGameView(game2, document.querySelector('#canvas2'));
view2.setupEvents();