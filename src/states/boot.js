function preload() {
    game.load.spritesheet("player1", "assets/player1.png", 64, 64);
    game.load.spritesheet("player2", "assets/player2.png", 64, 64);
    game.load.spritesheet("player3", "assets/player3.png", 64, 64);
    game.load.image("main_platform", "assets/main_platform.png");
    game.load.image("spawn_platform", "assets/spawn_platform.png");
    game.load.image("powerup_spawn", "assets/powerup_spawn.png");
    game.load.spritesheet("rope", "assets/rope.png", 32, 32);
    game.load.image("mallow", "assets/mallow.png");
    game.load.spritesheet(
        "mallow_surface",
        "assets/mallow_surface.png",
        32,
        32
    );
    game.load.spritesheet("powerups", "assets/powerups.png", 32, 32);

    game.load.bitmapFont(
        "mduel",
        "assets/fonts/marshmallowduel.png",
        "assets/fonts/marshmallowduel.fnt"
    );

    game.load.bitmapFont(
        "mduel",
        "assets/fonts/pc-senior.png",
        "assets/fonts/pc-senior.fnt"
    );
}

function create() {
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    game.state.start("Game");
}

export default { preload: preload, create: create };
