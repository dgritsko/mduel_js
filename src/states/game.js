import { playerConfig } from "../game/config";
import { Player } from "../game/player";
import { makeLevel } from "../game/generateLevel";
import { handlePlatformCollisions } from "../game/update/platformCollisions";
import { debugRender } from "../game/util";

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
    //const player2 = new Player("player2", 160, 300, 2);
    // const player3 = new Player("player3", 400, 300, 3);

    players.push(player1);
    //players.push(player2);
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
        player.update();

        handlePlatformCollisions(player, level);

        player.handleInput();
    });
}

function render() {
    //game.debug.text("FPS: " + game.time.fps || "FPS: --", 40, 40, "#00ff00");
    //game.debug.body(players[0].sprite);
    //level.platforms.forEach(p => game.debug.body(p));
}

export default { create: create, update: update, render: render };
