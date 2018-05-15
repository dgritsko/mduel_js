import { setupVoltsSprite } from "../game/spriteUtil";

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    setupVoltsSprite("player1");
}

export default { create };
