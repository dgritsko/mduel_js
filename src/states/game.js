import { playerConfig } from "../game/config";
import { Player } from "../game/player";
import { makeLevel } from "../game/generateLevel";
// import { handlePlayerMovement } from "../game/update/playerMovement";
// import { handlePlatformCollisions } from "../game/update/platformCollisions";
// import { handlePlayerCollisions } from "../game/update/playerCollisions";
// import { handleItemCollisions } from "../game/update/itemCollisions";
// import { handleLevelCollisions } from "../game/update/levelCollisions";
// import { handleItemUsage } from "../game/update/itemUsage";
// import { handlePowerupCollisions } from "../game/update/powerupCollisions";
// import { PlayerSnapshot } from "../game/playerSnapshot";
import { debugRender } from "../game/util";
import { makePlatform } from "../game/platform";
import { platform_types } from "../enums/platform_types";

let level;
const players = [];

function create() {
    game.time.advancedTiming = true;

    game.stage.disableVisibilityChange = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = playerConfig.GRAVITY;

    level = makeLevel();

    // const player1 = new Player('player1', 100, 100);
    // const player2 = new Player('player2', game.world.width - 100, 100);
    const player1 = new Player("player1", 60, 300, 1);
    // const player2 = new Player("player2", 160, 300, 2);
    // const player3 = new Player("player3", 400, 300, 3);

    players.push(player1);
    // players.push(player2);
    // players.push(player3);

    // const text = game.add.bitmapText(
    //     game.world.centerX,
    //     game.world.centerY,
    //     "mduel",
    //     "Percy vs. Clifford",
    //     32
    // );
    // text.tint = 0xa439a4;
}

function except(items, index) {
    const before = items.slice(0, index);
    const after = items.slice(index + 1);

    return [...before, ...after];
}

function update() {
    players.forEach(player => {
        player.handleInput();

        player.update();

        // debugRender({
        //     center: player.sprite.body.center,
        //     left: player.sprite.body.left,
        //     right: player.sprite.body.right
        // });

        // if (input.left) {
        //     player.update({ xVelocity: -playerConfig.RUN_SPEED });
        // } else if (input.right) {
        //     player.update({ xVelocity: playerConfig.RUN_SPEED });
        // } else {
        //     player.update({ xVelocity: 0 });
        // }

        // debugRender(input);

        // if (input.up) {
        //     player.update({ yVelocity: -playerConfig.JUMP_IMPULSE });
        // }

        const hitPlatform = game.physics.arcade.collide(
            player.sprite,
            level.platforms,
            () => {
                player.state.grounded = true;
            },
            (player, platform) =>
                player.body.velocity.y > 0 &&
                player.body.bottom <= platform.body.bottom
        );

        if (!hitPlatform) {
            player.state.grounded = false;
        }
    });
    // const playerSnapshots = players.map(p => new PlayerSnapshot(p));
    // playerSnapshots.forEach((playerSnapshot, index) => {
    //     const otherPlayerSnapshots = except(playerSnapshots, index);
    //     handlePlatformCollisions(playerSnapshot, level);
    //     handlePlayerCollisions(playerSnapshot, otherPlayerSnapshots);
    //     handleItemCollisions(playerSnapshot);
    //     handlePowerupCollisions(playerSnapshot);
    //     handleLevelCollisions(playerSnapshot);
    //     handleItemUsage(playerSnapshot);
    //     handlePlayerMovement(playerSnapshot, level);
    //     playerSnapshot.player.updateEvents();
    // });
    //debugRender(players[1].getDebugState());
}

function render() {
    game.debug.text("FPS: " + game.time.fps || "FPS: --", 40, 40, "#00ff00");

    game.debug.body(players[0].sprite);

    level.platforms.forEach(p => game.debug.body(p));
}

export default { create: create, update: update, render: render };
