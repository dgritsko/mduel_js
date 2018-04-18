import { animations } from "../../enums/animations";
import { playerConfig } from "../config";

function addAnimations(sprite) {
    const { FRAMERATE } = playerConfig;

    sprite.animations.add(animations.STAND, [0], 0, false);
    sprite.animations.add(animations.RUN, [1, 2, 3, 4], FRAMERATE, true);

    sprite.animations.add(animations.CROUCHING, [6, 5], FRAMERATE, false);

    sprite.animations.add(animations.CROUCHED, [5], 0, false);

    sprite.animations.add(animations.UNCROUCH, [5, 6], FRAMERATE, false);
    sprite.animations.add(
        animations.STAND_JUMP,
        [6, 12, 13, 14, 15, 16, 17, 21],
        FRAMERATE,
        false
    );

    sprite.animations.add(
        animations.RUN_JUMP,
        [17, 18, 19, 20, 20, 21],
        FRAMERATE,
        false
    );

    sprite.animations.add(
        animations.FORWARD_FALL,
        [26, 27],
        FRAMERATE / 2,
        true
    );

    sprite.animations.add(
        animations.BACKWARD_FALL,
        [28, 29],
        FRAMERATE / 2,
        true
    );

    sprite.animations.add(
        animations.FORWARD_ROLL,
        [7, 8, 9, 10],
        FRAMERATE,
        false
    );

    sprite.animations.add(
        animations.BACKWARD_ROLL,
        [6, 22, 23, 24, 25],
        FRAMERATE,
        false
    );

    sprite.animations.add(animations.STAND_FALL, [21], 0, true);

    sprite.animations.add(
        animations.CLIMB_UP,
        [39, 40, 41, 42],
        FRAMERATE,
        true
    );

    sprite.animations.add(
        animations.CLIMB_DOWN,
        [41, 40, 39, 42],
        FRAMERATE,
        true
    );

    sprite.animations.add(animations.PARACHUTE, [36], FRAMERATE, true);

    sprite.animations.add(animations.GRENADE_TOSS, [32, 33], FRAMERATE, false);

    sprite.animations.add(animations.PUCK_TOSS, [34, 35], FRAMERATE, false);

    sprite.animations.add(animations.MINE_PLANT, [6, 35], FRAMERATE, false);

    sprite.animations.add(animations.SHOOT, [30, 31, 31, 30], FRAMERATE, false);

    sprite.animations.add(
        animations.SKULLED,
        [50, 51, 52, 53, 66],
        FRAMERATE,
        false
    );

    sprite.animations.add(
        animations.DISINTEGRATED,
        [54, 55, 56, 57, 66],
        FRAMERATE,
        false
    );

    sprite.animations.add(
        animations.VICTORY_DANCE,
        [58, 59, 60, 61, 62, 63, 63, 63, 63, 63],
        FRAMERATE,
        false
    );

    sprite.animations.add(animations.ROPE_VICTORY, [46, 47], FRAMERATE, false);

    sprite.animations.add(animations.VICTORY_FLEX, [44, 45], FRAMERATE, false);
}

export { addAnimations };
