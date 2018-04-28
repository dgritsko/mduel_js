import { gameStates } from "../enums/gameStates";

function preload() {
    game.load.spritesheet("player1", "assets/player1.png", 64, 64);
    game.load.spritesheet("player2", "assets/player2.png", 64, 64);
    game.load.spritesheet("player3", "assets/player3.png", 64, 64);
    game.load.spritesheet("player1_1000v", "assets/player_1000v.png", 32, 32);
    game.load.spritesheet("platform", "assets/platforms.png", 28, 16);
    game.load.image("powerup_spawn", "assets/powerup_spawn.png");
    game.load.spritesheet("rope", "assets/rope.png", 32, 32);
    game.load.image("mallow", "assets/mallow.png");
    game.load.spritesheet(
        "mallow_surface",
        "assets/mallow_surface.png",
        32,
        32
    );
    game.load.spritesheet("items", "assets/items.png", 32, 32);
    game.load.spritesheet("effects", "assets/effects.png", 32, 32);

    game.load.bitmapFont(
        "mduel",
        "assets/fonts/marshmallowduel.png",
        "assets/fonts/marshmallowduel.fnt"
    );

    game.load.bitmapFont(
        "mduel-menu",
        "assets/fonts/pc-senior.png",
        "assets/fonts/pc-senior.fnt"
    );
}

function create() {
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    const config = {
        players: [
            {
                playerName: "Percy",
                spriteName: "player1",
                x: 63,
                y: 300,
                playerId: 1,
                teamId: 1
            },

            {
                playerName: "Clifford",
                spriteName: "player2",
                x: game.world.width - 63,
                y: 300,
                playerId: 2,
                teamId: 2
            }
        ]
    };

    game.state.start(gameStates.GAME, true, false, config);
}

export default { preload: preload, create: create };
