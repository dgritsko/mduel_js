import { gameConfig } from "../game/config";
import { Player } from "../game/Player/player";
import { createNewLevel } from "../game/Level/level";
import { playEffect, playSound } from "../game/util";
import { effects } from "../enums/effects";
import { GameManager } from "../game/gameManager";
import { sounds } from "../enums/sounds";

import Gamepad from "../game/Player/gamepad";
import Keyboard from "../game/Player/keyboard";
import { setupInput } from "../game/Player/inputUtil";

let gameManager;
let config;

function init(data) {
    config = data;
}

function create() {
    game.time.advancedTiming = true;

    game.stage.disableVisibilityChange = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = gameConfig.GRAVITY;

    const level = createNewLevel();

    const spawnIndexes = {};
    config.teams.forEach(t => (spawnIndexes[t.id] = 0));

    const players = config.players.map((p, i) => {
        const team = config.teams.filter(t => t.id === p.teamId)[0];

        const spawn = team.spawns[spawnIndexes[team.id]];
        spawnIndexes[team.id]++;

        // TODO: Figure out a more robust system for assigning input
        const input = setupInput(p.inputId);

        return new Player(
            p.name,
            p.sprite,
            spawn.x,
            spawn.y,
            p.id,
            p.teamId,
            input
        );
    });

    players.forEach(p => playEffect(effects.PURPLE_PUFF, p.x, p.y));

    playSound(sounds.BOOM);

    gameManager = new GameManager(level, players, config);

    // NOTE: Experimental! Works great on big levels if there's only one local player, but not a great
    // solution if there's more than one player. Splitscreen?
    game.camera.follow(players[0].sprite);
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

    if (gameConfig.DEBUG_SHOW_PLATFORM_BOUNDS) {
        gameManager.level.platforms.forEach(platform => {
            game.debug.geom(
                new Phaser.Rectangle(
                    platform.x - platform.width / 2,
                    platform.y - platform.height / 2,
                    platform.width,
                    platform.height
                )
            );
        });
    }
}

export default { init, create, update, render };
