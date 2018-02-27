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

        if (!player.state.climbingRope) {
            handlePlatformCollisions(player, level);
        }

        let hitRope = false;
        level.ropes.forEach(r => {
            const hitCurrentRope = game.physics.arcade.overlap(
                player.sprite,
                r.segments,
                () => {
                    player.state.touchingRope = r;
                },
                (player, segment) => {
                    const dist = player.body.center.x - segment.body.center.x;

                    // TODO: move this to a constant
                    return Math.abs(dist) <= 5;
                }
            );

            hitRope = hitRope || hitCurrentRope;
        });

        if (!hitRope) {
            player.state.touchingRope = null;
        }

        player.handleInput();
    });
}

function render() {
    //game.debug.text("FPS: " + game.time.fps || "FPS: --", 40, 40, "#00ff00");

    // render hitboxes
    if (false) {
        players.forEach(p => game.debug.body(p.sprite));
        level.platforms.forEach(p => game.debug.body(p));

        level.ropes.forEach(r => {
            game.debug.body(r.anchor);
            r.segments.children.forEach(s => game.debug.body(s))
        })
    }
}

export default { create: create, update: update, render: render };
