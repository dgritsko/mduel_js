import { now } from '../../util/util';
import cfg from '../../gameConfig';
import { locations, Player } from '../../player';

let player1;

function create() {
    // game.physics.startSystem(Phaser.Physics.ARCADE);
    // game.physics.arcade.gravity.y = cfg.gravity;

    player1 = new Player('player1', game.world.centerX, game.world.centerY);

    player1.sprite.animations.play('custom1');

    player1.eventQueue.push({ time: now() + 1000, event: () => player1.sprite.animations.play('run')});
    player1.eventQueue.push({ time: now() + 2000, event: () => player1.sprite.animations.play('crouch')});
}

function update() {
    player1.updateEvents();
}

export default {create: create, update: update};