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
    CROUCHING_BOUNDS: { top: -4, right: 10, bottom: 24, left: -10 }
};

const itemConfig = {
    powerupSpeed: 20
};

const levelConfig = {
    ropeDist: 10,
    platformYDist: 16,
    verticalSpacing: 64,
    verticalOffset: 80,
    horizontalSpacing: 32,
    horizontalOffset: 32,
    wallThreshold: 16
};

export { playerConfig, itemConfig, levelConfig };
