const XOGame = require('./XOGame'),
			XOGameView = require('./XOGameView');

const game = new XOGame(4);
const view = new XOGameView(game, document.querySelector('#canvas'));
view.setupEvents();