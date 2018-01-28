import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

import bootState from './states/boot';
import gameState from './states/game';

const fullscreen = new URL(document.location).searchParams.get('fullscreen') === 'true';
  
if (fullscreen) {
//   $('#fullscreen a').hide();
//   MarshmallowDuel.fullscreen = true;
} else {
//   $('#fullscreen a').click(function() {
//     if (confirm('Restart game in fullscreen mode?')) {
//       window.location.href = '?fullscreen=true';
//     }
//   });
}

const game = new Phaser.Game(640, 400, Phaser.AUTO, 'game');

window.game = game;

game.state.add('Boot', bootState);
game.state.add('Game', gameState);

game.state.start('Boot');