import { gameConfig, playerConfig } from "../game/config";
import { Player } from "../game/Player/player";
import { createNewLevel } from "../game/Level/level";
import { playEffect } from "../game/util";
import { effects } from "../enums/effects";
import { GameManager } from "../game/gameManager";

let gameManager;

function create() {
    game.time.advancedTiming = true;

    game.stage.disableVisibilityChange = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = playerConfig.GRAVITY;

    const level = createNewLevel();
    const players = [];

    // const player1 = new Player('player1', 100, 100);
    const player1 = new Player("player1", 63, 300, 1, 1);
    const player2 = new Player("player2", game.world.width - 63, 300, 2, 2);
    //const player2 = new Player("player2", 160, 300, 2);
    // const player3 = new Player("player3", 400, 300, 3, 2);

    // player1.x = 500;
    // player1.y = 10;
    // player1.vy = -300;
    // player1.bounce();

    // player2.y = 300;

    players.push(player1);
    players.push(player2);
    // players.push(player3);

    players.forEach(p => playEffect(effects.PURPLE_PUFF, p.x, p.y));

    gameManager = new GameManager(level, players);
}

function update() {
    gameManager.update();
}

function render() {
    if (gameConfig.DEBUG_SHOW_FPS) {
        game.debug.text(
            "FPS: " + game.time.fps || "FPS: --",
            40,
            40,
            "#00ff00"
        );
    }

    if (gameConfig.DEBUG_SHOW_HITBOXES) {
        gameManager.players.forEach(p => game.debug.body(p.sprite));
        gameManager.level.platforms.forEach(p => game.debug.body(p));

        gameManager.level.ropes.forEach(r => {
            game.debug.body(r.anchor);
            r.segments.children.forEach(s => game.debug.body(s));
        });

        gameManager.itemManager.activeItems.children.forEach(i =>
            game.debug.body(i)
        );

        gameManager.itemManager.activeProjectiles.forEach(p =>
            game.debug.body(p.sprite)
        );
    }
}

export default { create: create, update: update, render: render };
