import { gameConfig, playerConfig } from "../game/config";
import { Player } from "../game/Player/player";
import { ItemManager } from "../game/Items/itemManager";
import { createNewLevel } from "../game/Level/level";
import { handlePlatformCollisions } from "../game/update/platformCollisions";
import { handlePlayerCollisions } from "../game/update/playerCollisions";
import { handleRopeCollisions } from "../game/update/ropeCollisions";
import { handlePickupItemCollisions } from "../game/update/pickupItemCollisions";
import { exceptIndex, debugRender, playEffect } from "../game/util";
import { effects } from "../enums/effects";
import { GameManager } from "../game/gameManager";

let itemManager;
let gameManager;

function create() {
    game.time.advancedTiming = true;

    game.stage.disableVisibilityChange = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = playerConfig.GRAVITY;

    const level = createNewLevel();
    const players = [];

    // const player1 = new Player('player1', 100, 100);
    const player1 = new Player("player1", 60, 300, 1);
    const player2 = new Player("player2", game.world.width - 100, 100, 2);
    //const player2 = new Player("player2", 160, 300, 2);
    // const player3 = new Player("player3", 400, 300, 3);

    players.push(player1);
    players.push(player2);
    // players.push(player3);

    // const text = game.add.bitmapText(
    //     game.world.centerX,
    //     game.world.centerY,
    //     "mduel",
    //     "Percy vs. Clifford",
    //     32
    // );
    // text.tint = 0xa439a4;
    itemManager = new ItemManager(level);

    players.forEach(p => playEffect(effects.PURPLE_PUFF, p.x, p.y));

    gameManager = new GameManager(level, players);
}

function update() {
    gameManager.players.forEach((player, index) => {
        player.update(itemManager, gameManager);

        if (!player.state.climbingRope) {
            handlePlatformCollisions(player, gameManager.level);
        } else {
            player.state.grounded = false;
        }

        handleRopeCollisions(player, gameManager.level);

        player.handleInput(itemManager, gameManager);

        const otherPlayers = exceptIndex(gameManager.players, index);
        handlePlayerCollisions(player, otherPlayers, gameManager);

        handlePickupItemCollisions(
            player,
            gameManager.level,
            itemManager,
            gameManager
        );
    });

    itemManager.update(gameManager);
}

function render() {
    if (gameConfig.SHOW_FPS) {
        game.debug.text(
            "FPS: " + game.time.fps || "FPS: --",
            40,
            40,
            "#00ff00"
        );
    }

    if (gameConfig.SHOW_HITBOXES) {
        gameManager.players.forEach(p => game.debug.body(p.sprite));
        gameManager.level.platforms.forEach(p => game.debug.body(p));

        gameManager.level.ropes.forEach(r => {
            game.debug.body(r.anchor);
            r.segments.children.forEach(s => game.debug.body(s));
        });

        itemManager.activeItems.children.forEach(i => game.debug.body(i));

        itemManager.activeProjectiles.forEach(p => game.debug.body(p.sprite));
    }

    debugRender(gameManager.players[0].state.currItem);
    //debugRender(itemManager.activeProjectiles.length);
}

export default { create: create, update: update, render: render };
