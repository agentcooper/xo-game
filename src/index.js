var XOGame = require('./XOGame');
var XOGameView = require('./XOGameView');

var game = new XOGame(4);
var view = new XOGameView(game, document.querySelector('#canvas'));
view.setupEvents();