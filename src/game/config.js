const gameConfig = {
    SHOW_HITBOXES: false,
    SHOW_FPS: false,

    ROPE_THRESHOLD: 8
};

const playerConfig = {
    GRAVITY: 600,
    JUMP_IMPULSE: 240,
    CLIMB_SPEED: 100,
    RUN_SPEED: 100,
    TERMINAL_VELOCITY: 600,
    SPRITE_WIDTH: 64,
    SPRITE_HEIGHT: 64,
    STANDING_BOUNDS: { top: -22, right: 10, bottom: 24, left: -10 },
    FALLING_BOUNDS: { top: -22, right: 10, bottom: 24, left: -10 },
    CROUCHING_BOUNDS: { top: -4, right: 10, bottom: 24, left: -10 },
    FRAMERATE: 10
};

const itemConfig = {
    ITEM_BOUNDS: { top: -6, bottom: 6, left: -6, right: 6 },
    MAX_ITEMS: 3,
    ITEM_SPEED: 100
};

const levelConfig = {
    TEST_LEVEL: false,
    LEVEL_HEIGHT: 5,
    LEVEL_WIDTH: 18,
    SPAWN_WIDTH: 4,
    MAX_SECTION_WIDTH: 7,
    MIN_SECTION_WIDTH: 2,
    MAX_GAP_WIDTH: 2,
    MIN_GAP_WIDTH: 1,
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
    COLUMN_OFFSET: 32,
    ROW_HEIGHT: 64,
    ROW_OFFSET: 80,

    ROPE_ANCHOR_BOUNDS: { top: 6, bottom: 5, left: -5.5, right: 6.5 },
    ROPE_SEGMENT_BOUNDS: { top: -16, bottom: 16, left: -1, right: 3 },

    MARSHMALLOW_FRAMERATE: 0.25
};

export { gameConfig, playerConfig, itemConfig, levelConfig };
