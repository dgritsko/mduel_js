import { locations } from "../../enums/locations";
import { animations } from "../../enums/animations";
import cfg from "../../gameConfig";
import { directions } from "../../enums/directions";
import { positions } from "../../enums/positions";
import index from "./index";
import { matchingProps } from "../../util/util";

const basicState = { position: positions.DEFAULT };
const moveLeft = { direction: directions.LEFT, xVelocity: -cfg.runSpeed };
const moveRight = { direction: directions.RIGHT, xVelocity: cfg.runSpeed };
const moveJump = { yVelocity: -cfg.jumpSpeed, location: locations.AIR };

const nearbyRope = (player, level) => {
    const x = player.sprite.x;
    const y = player.sprite.y + player.sprite.offsetY;
    const ropes = level.ropes
        .filter(r => r.x >= x - cfg.ropeDist && r.x <= x + cfg.ropeDist)
        .filter(r => y >= r.y && y <= r.y + r.height + cfg.ropeDist);

    return ropes.length === 1 ? ropes[0] : null;
};

const stayOnRope = player => {
    if (player.rope) {
        let { y } = player.getState();
        y = Math.max(y, player.rope.top.y + player.sprite.offsetY - 8);
        y = Math.min(y, player.rope.bottom.y - player.sprite.offsetY);
        player.applyState({ y });
    }
};

const climbRope = (player, rope) => {
    player.applyState({ location: locations.ROPE, x: rope.x });
    player.rope = {
        top: { x: rope.x, y: rope.y },
        bottom: { x: rope.x, y: rope.y + rope.height }
    };
};

const performRoll = direction => {
    const runSpeed =
        direction === directions.LEFT ? -cfg.runSpeed : cfg.runSpeed;

    return [
        {
            animation: animations.FORWARD_ROLL,
            direction,
            xVelocity: runSpeed,
            position: positions.ROLLING
        },
        {
            animation: animations.CROUCH,
            xVelocity: 0,
            position: positions.CROUCHING
        }
    ];
};

const runLeft = {
    match: {
        location: locations.PLATFORM,
        left: true,
        down: false,
        position: [positions.DEFAULT, positions.CROUCHING]
    },
    act: Object.assign({ animation: animations.RUN }, basicState, moveLeft)
};

const runRight = {
    match: {
        location: locations.PLATFORM,
        right: true,
        down: false,
        position: [positions.DEFAULT, positions.CROUCHING]
    },
    act: Object.assign({ animation: animations.RUN }, basicState, moveRight)
};

const jumpLeft = {
    match: {
        location: locations.PLATFORM,
        left: true,
        up: true,
        down: false,
        position: positions.DEFAULT
    },
    act: Object.assign(
        { animation: animations.RUN_JUMP },
        basicState,
        moveLeft,
        moveJump
    )
};

const jumpRight = {
    match: {
        location: locations.PLATFORM,
        right: true,
        up: true,
        down: false,
        position: positions.DEFAULT
    },
    act: Object.assign(
        { animation: animations.RUN_JUMP },
        basicState,
        moveRight,
        moveJump
    )
};

const jumpUpOrClimb = {
    match: {
        location: locations.PLATFORM,
        position: positions.DEFAULT,
        up: true,
        left: false,
        right: false
    },
    act: (player, level, state) => {
        const rope = nearbyRope(player, level);

        if (rope && state.xVelocity === 0) {
            climbRope(player, rope);
        } else {
            // TODO: Tweak jump animation
            if (state.xVelocity === 0) {
                player.queueEvents([
                    { animation: animations.TRANSITION },
                    {
                        animation: animations.STAND_JUMP,
                        location: locations.AIR,
                        position: positions.DEFAULT,
                        yVelocity: -cfg.jumpSpeed
                    }
                ]);
            } else {
                player.applyState({ xVelocity: 0 });
            }
        }
    }
};

const crouchOrClimb = {
    match: {
        location: locations.PLATFORM,
        down: true,
        left: false,
        right: false
    },
    act: (player, level, state) => {
        const rope = nearbyRope(player, level);

        if (
            rope &&
            state.position === positions.DEFAULT &&
            state.xVelocity == 0
        ) {
            climbRope(player, rope);
        } else {
            if (state.xVelocity != 0) {
                // TODO: Automatically roll when landing on platform and pressing down with some x-momentum
                player.queueEvents(performRoll(state.direction));
            } else {
                player.applyState({
                    position: positions.CROUCHING,
                    animation: animations.CROUCH,
                    xVelocity: 0
                });
            }
        }
    }
};

const climbUpRope = {
    match: { location: locations.ROPE, up: true },
    act: (player, level) => {
        player.applyState({
            animation: animations.CLIMB,
            position: positions.DEFAULT,
            dy: -cfg.climbRate
        });
        stayOnRope(player);
    }
};

const climbDownRope = {
    match: { location: locations.ROPE, down: true },
    act: (player, level) => {
        player.applyState({
            animation: animations.CLIMB,
            position: positions.DEFAULT,
            dy: cfg.climbRate
        });
        stayOnRope(player);
    }
};

const fallOffRopeLeft = {
    match: { location: locations.ROPE, left: true },
    act: Object.assign(
        { animation: animations.STAND_FALL, location: locations.AIR },
        basicState,
        moveLeft
    )
};

const fallOffRopeRight = {
    match: { location: locations.ROPE, right: true },
    act: Object.assign(
        { animation: animations.STAND_FALL, location: locations.AIR },
        basicState,
        moveRight
    )
};

const rollLeft = {
    match: {
        location: locations.PLATFORM,
        position: positions.DEFAULT,
        down: true,
        left: true
    },
    act: performRoll(directions.LEFT)
};

const rollRight = {
    match: {
        location: locations.PLATFORM,
        position: positions.DEFAULT,
        down: true,
        right: true
    },
    act: performRoll(directions.RIGHT)
};

const behaviors = [
    runLeft,
    runRight,
    jumpLeft,
    jumpRight,
    crouchOrClimb,
    jumpUpOrClimb,
    climbUpRope,
    climbDownRope,
    fallOffRopeLeft,
    fallOffRopeRight,
    rollLeft,
    rollRight
];

const handlePlayerMovement = (player, level) => {
    let bestMatch = null;
    let bestScore = 0;
    let bestMatchIndex = -1;

    const playerState = Object.assign({}, player.getState(), player.getInput());

    if (playerState.inputEnabled && playerState.anyInput) {
        for (let i = 0; i < behaviors.length; i++) {
            const behavior = behaviors[i];

            const behaviorScore = matchingProps(playerState, behavior.match);

            if (
                behaviorScore.actual === behaviorScore.target &&
                bestScore < behaviorScore.actual
            ) {
                bestScore = behaviorScore.actual;
                bestMatch = behavior;
                bestMatchIndex = i;
            }
        }

        if (bestMatch && bestScore > 0) {
            if (Array.isArray(bestMatch.act)) {
                player.queueEvents(bestMatch.act);
            } else if (typeof bestMatch.act === "function") {
                bestMatch.act(player, level, playerState);
            } else if (typeof bestMatch.act === "object") {
                player.applyState(bestMatch.act);
            }
        }
    }

    if (!bestMatch && player.eventQueue.length === 0 && !playerState.anyInput) {
        switch (playerState.location) {
            case locations.PLATFORM:
                player.applyState({
                    animation: animations.STAND,
                    xVelocity: 0,
                    position: positions.DEFAULT
                });
                break;
            case locations.ROPE:
                player.applyState({
                    animation: animations.NONE,
                    position: positions.DEFAULT
                });
                break;
        }
    }
};

export { handlePlayerMovement };
