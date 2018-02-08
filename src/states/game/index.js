import cfg from "../../gameConfig";
import { locations, Player } from "../../player";
import { makeLevel } from "../../gameutil/level";
import { handlePlayerMovement } from "./playerMovement";
import { handlePlatformCollisions } from "./platformCollisions";
import { handlePlayerCollisions } from "./playerCollisions";
import { handleItemCollisions } from "./itemCollisions";
import { handleLevelCollisions } from "./levelCollisions";
import { handleItemUsage } from "./itemUsage";
import { handlePowerupCollisions } from "./powerupCollisions";
import { PlayerSnapshot } from "../../playerSnapshot";

let level;
const players = [];

function create() {
    game.stage.disableVisibilityChange = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = cfg.gravity;

    level = makeLevel();

    // const player1 = new Player('player1', 100, 100);
    // const player2 = new Player('player2', game.world.width - 100, 100);
    const player1 = new Player("player1", 60, 300, 1);
    const player2 = new Player("player2", 160, 300, 2);

    players.push(player1);
    players.push(player2);

    // const text = game.add.bitmapText(
    //     game.world.centerX,
    //     game.world.centerY,
    //     "mduel",
    //     "Percy vs. Clifford",
    //     32
    // );
    // text.tint = 0xa439a4;
}

function update() {
    // each player:
    // 1. collide with platforms.
    // 2. collide with other players
    // 3. collide with items
    // 4. collide with powerups
    // 5. collide with pit
    // 6. collide with walls

    // then, if input enabled and on rope or platform:
    // 1. handle input appropriately
    // 2. if no input, then use default behavior for rope or platform

    // handle item usage on action keypress (NOT if key was pressed prior to this)

    function except(items, index) {
        const before = items.slice(0, index);
        const after = items.slice(index + 1);

        return [...before, ...after];
    }

    const playerSnapshots = players.map(p => new PlayerSnapshot(p));

    playerSnapshots.forEach((playerSnapshot, index) => {
        const otherPlayerSnapshots = except(playerSnapshots, index);

        handlePlatformCollisions(playerSnapshot, level);

        handlePlayerCollisions(playerSnapshot, otherPlayerSnapshots);

        handleItemCollisions(playerSnapshot);

        handlePowerupCollisions(playerSnapshot);

        handleLevelCollisions(playerSnapshot);

        handleItemUsage(playerSnapshot);

        handlePlayerMovement(playerSnapshot, level);

        playerSnapshot.player.updateEvents();
    });

    const debug = JSON.stringify(players[0].getState());
    game.debug.text(debug.substr(0, 60), 2, 14, "#ff0000");
    game.debug.text(debug.substr(60, 60), 2, 30, "#ff0000");
    game.debug.text(debug.substr(120, 60), 2, 46, "#ff0000");

    //game.debug.text(player1.sprite.animations, 2, 14, '#ff0000');
    //game.debug.body(player1.sprite);
}

export default { create: create, update: update };
