import { gameConfig, playerConfig } from "../game/config";
import { Player } from "../game/Player/player";
import { ItemManager } from "../game/Items/itemManager";
import { createNewLevel } from "../game/Level/level";
import { handlePlatformCollisions } from "../game/update/platformCollisions";
import { handlePlayerCollisions } from "../game/update/playerCollisions";
import { handleRopeCollisions } from "../game/update/ropeCollisions";
import { exceptIndex, debugRender } from "../game/util";

let level;
const players = [];
let itemManager;

function create() {
    game.time.advancedTiming = true;

    game.stage.disableVisibilityChange = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = playerConfig.GRAVITY;

    level = createNewLevel();

    // const player1 = new Player('player1', 100, 100);
    // const player2 = new Player('player2', game.world.width - 100, 100);
    const player1 = new Player("player1", 60, 300, 1);
    const player2 = new Player("player2", 160, 300, 2);
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
}

function update() {
    players.forEach((player, index) => {
        player.update();

        if (!player.state.climbingRope) {
            handlePlatformCollisions(player, level);
        }

        handleRopeCollisions(player, level);

        player.handleInput();

        const otherPlayers = exceptIndex(players, index);
        handlePlayerCollisions(player, otherPlayers);
    });

    itemManager.update();
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
        players.forEach(p => game.debug.body(p.sprite));
        level.platforms.forEach(p => game.debug.body(p));

        level.ropes.forEach(r => {
            game.debug.body(r.anchor);
            r.segments.children.forEach(s => game.debug.body(s));
        });
    }
}

export default { create: create, update: update, render: render };
