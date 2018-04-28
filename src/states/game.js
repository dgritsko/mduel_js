import { gameConfig } from "../game/config";
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
    game.physics.arcade.gravity.y = gameConfig.GRAVITY;

    const level = createNewLevel();
    const players = [];

    const player1 = new Player("Percy", "player1", 63, 300, 1, 1);
    const player2 = new Player(
        "Clifford",
        "player2",
        game.world.width - 63,
        300,
        2,
        2
    );

    players.push(player1);
    players.push(player2);

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
