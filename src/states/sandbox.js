import cfg from '../gameConfig';
import { locations, Player } from '../player';

function create() {
    // game.physics.startSystem(Phaser.Physics.ARCADE);
    // game.physics.arcade.gravity.y = cfg.gravity;

    const player1 = new Player('player1', game.world.centerX, game.world.centerY);

    player1.sprite.animations.play('custom1');
}

function update() {

}

export default {create: create, update: update};