const gameConfig = {
    DEBUG_SKIP_LOBBY: false,
    DEBUG_SHOW_HITBOXES: false,
    DEBUG_SHOW_FPS: false,
    DEBUG_SHOW_GUN_PATH: false,
    DEBUG_SHOW_PLATFORM_BOUNDS: false,
    DEBUG_ITEMS: [
        // { x: 70, y: 300, type: 7 }
        // { x: 200, y: 300, type: 11 },
        // { x: 300, y: 310, type: 11 }
        // DEATH: 0,
        // VOLTS: 1,
        // INVISIBILITY: 2,
        // MINE: 3,
        // GUN: 4,
        // TNT: 5,
        // BOOTS: 6,
        // GRENADE: 7,
        // PUCK: 8,
        // CHUTE: 9,
        // HOOK: 10,
        // WARP: 11
    ],
    DEBUG_LEVEL: false,
    DEBUG_PLATFORMS: [
        { row: 2, column: 1, width: 4, isSpawn: false },
        { row: 3, column: 1, width: 4, isSpawn: false },
        { row: 4, column: 0.5, width: 12, isSpawn: true },
        { row: 4, column: 13.5, width: 4, isSpawn: true }
    ],

    GAME_CONTAINER_WIDTH: 640,
    GAME_CONTAINER_HEIGHT: 400,

    GAME_WIDTH: 640,
    GAME_HEIGHT: 400,

    ROPE_THRESHOLD: 8,

    // Player
    GRAVITY: 600,
    PLAYER_SPRITE_WIDTH: 64,
    PLAYER_SPRITE_HEIGHT: 64,

    PLAYER_JUMP_IMPULSE: 240,
    MINIMUM_JUMP_INTERVAL: 100,
    PLAYER_CLIMB_SPEED: 100,
    PLAYER_RUN_SPEED: 100,
    PLAYER_TERMINAL_VELOCITY: 600,
    POWERHIT_SPEED: 1200,
    PARACHUTE_TERMINAL_VELOCITY: 75,

    PLAYER_STANDING_BOUNDS: { top: -22, right: 10, bottom: 24, left: -10 },
    PLAYER_FALLING_BOUNDS: { top: -22, right: 10, bottom: 24, left: -10 },
    PLAYER_CROUCHING_BOUNDS: { top: -4, right: 10, bottom: 24, left: -10 },
    FRAMERATE: 10,

    // Item
    ITEM_BOUNDS: { top: -6, bottom: 6, left: -6, right: 6 },
    MAX_ITEMS: 3,
    ITEM_MINIMUM_SPEED: 30,
    ITEM_MAXIMUM_SPEED: 75,
    ITEM_MINIMUM_LIFETIME: 10000,
    ITEM_MAXIMUM_LIFETIME: 25000,
    ITEM_INITIAL_SPAWN_DELAY: 1000,
    ITEM_MINIMUM_SPAWN_DELAY: 2600,
    ITEM_MAXIMUM_SPAWN_DELAY: 5000,

    // Gun
    ITEM_GUN_Y_OFFSET: -8,

    // Puck
    ITEM_PUCK_PROJECT_X_OFFSET: 8,
    ITEM_PUCK_PROJECT_Y_OFFSET: 16,
    ITEM_PUCK_PROJECT_FIRE_DELAY: 100,
    ITEM_PUCK_FIRE_DELAY: 400,
    ITEM_PUCK_PROJECT_BOUNDS: { top: 11, bottom: 16, left: -4, right: 8 },

    // Mine
    ITEM_MINE_PROJECT_BOUNDS: { top: -5, bottom: 5, left: -5, right: 5 },

    // Grenade
    ITEM_GRENADE_PROJECT_BOUNDS: { top: 3, right: 7, bottom: 12, left: -3 },

    // Level
    LEVEL_HEIGHT: 5,
    LEVEL_WIDTH: 18,
    LEVEL_MAX_SECTION_WIDTH: 7,
    LEVEL_MIN_SECTION_WIDTH: 2,
    LEVEL_MAX_GAP_WIDTH: 2,
    LEVEL_MIN_GAP_WIDTH: 1,
    FIXED_PLATFORMS: [
        { row: 0, column: 2, width: 4, isSpawn: false },
        { row: 0, column: 12, width: 4, isSpawn: false },
        { row: 4, column: 0.5, width: 4, isSpawn: true },
        { row: 4, column: 13.5, width: 4, isSpawn: true }
    ],

    FIXED_ROPES: [
        { column: 3.5, row: 0, length: 5 },
        { column: 13.5, row: 0, length: 5 }
    ],

    MIN_RANDOM_ROPES: 2,
    MAX_RANDOM_ROPES: 5,

    COLUMN_WIDTH: 32,
    COLUMN_OFFSET: 47,
    ROW_HEIGHT: 64,
    ROW_OFFSET: 88,

    ROPE_ANCHOR_BOUNDS: { top: 5, bottom: 16, left: -5.5, right: 6.5 },
    ROPE_SEGMENT_BOUNDS: { top: -16, bottom: 16, left: -1, right: 3 },

    // originally: -8 and 8 for left/right
    PLATFORM_BOUNDS: { top: -8, bottom: 0, left: -14, right: 14 },

    MARSHMALLOW_FRAMERATE: 0.25
};

export { gameConfig };
