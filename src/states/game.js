import cfg from "../game/config";
import { Player } from "../game/player";
import { makeLevel } from "../game/generateLevel";
import { handlePlayerMovement } from "../game/update/playerMovement";
import { handlePlatformCollisions } from "../game/update/platformCollisions";
import { handlePlayerCollisions } from "../game/update/playerCollisions";
import { handleItemCollisions } from "../game/update/itemCollisions";
import { handleLevelCollisions } from "../game/update/levelCollisions";
import { handleItemUsage } from "../game/update/itemUsage";
import { handlePowerupCollisions } from "../game/update/powerupCollisions";
import { PlayerSnapshot } from "../game/playerSnapshot";
import { debugRender } from "../game/util";

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
    const player3 = new Player("player3", 400, 300, 3);

    players.push(player1);
    players.push(player2);
    players.push(player3);

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

    //debugRender(players[1].getDebugState());
}

export default { create: create, update: update };
