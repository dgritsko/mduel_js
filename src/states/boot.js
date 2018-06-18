import { gameStates } from "../enums/gameStates";
import { sounds } from "../enums/sounds";
import { gameConfig } from "../game/config";
import {
    createModifiedSpritesheet,
    grayscale,
    setupVoltsSprite
} from "../game/spriteUtil";

function preload() {
    game.load.spritesheet("player1", "assets/player1.png", 64, 64);
    game.load.spritesheet("player2", "assets/player2.png", 64, 64);
    game.load.spritesheet("player3", "assets/player3.png", 64, 64);

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

    game.load.audio(sounds.BOOM, "assets/sounds/boom.wav");
    game.load.audio(
        sounds.INVISIBILITY_ON,
        "assets/sounds/invisibility_on.wav"
    );
    game.load.audio(
        sounds.INVISIBILITY_OFF,
        "assets/sounds/invisibility_off.wav"
    );
    game.load.audio(sounds.SHOOT, "assets/sounds/shoot.wav");
    game.load.audio(sounds.VOLTS, "assets/sounds/volts.wav");
}

function create() {
    createModifiedSpritesheet("items", "items_grayscale", grayscale);

    setupVoltsSprite("player1");
    setupVoltsSprite("player2");
    setupVoltsSprite("player3");

    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    game.input.gamepad.start();

    game.world.setBounds(0, 0, gameConfig.GAME_WIDTH, gameConfig.GAME_HEIGHT);

    game.state.start(gameStates.LOBBY, true, false, { default: gameConfig.DEBUG_SKIP_LOBBY });
}

export default { preload, create };
