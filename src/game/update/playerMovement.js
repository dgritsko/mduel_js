import { locations } from "../../enums/locations";
import { animations } from "../../enums/animations";
import cfg from "../config";
import { directions } from "../../enums/directions";
import { positions } from "../../enums/positions";
import { matchingProps } from "../util";

const basicState = { position: positions.DEFAULT };
const moveLeft = { direction: directions.LEFT, xVelocity: -cfg.runSpeed };
const moveRight = { direction: directions.RIGHT, xVelocity: cfg.runSpeed };
const moveJump = { yVelocity: -cfg.jumpSpeed, location: locations.AIR };

const speedFromDirection = d =>
    d === directions.LEFT ? -cfg.runSpeed : cfg.runSpeed;

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
        player.update({ y });
    }
};

const getOnRope = (player, rope) => {
    player.update({ location: locations.ROPE, x: rope.x });
    player.rope = {
        top: { x: rope.x, y: rope.y },
        bottom: { x: rope.x, y: rope.y + rope.height }
    };
};

const performRoll = direction => {
    const runSpeed = speedFromDirection(direction);

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

const run = {
    match: {
        location: locations.PLATFORM,
        down: false,
        position: [positions.DEFAULT, positions.CROUCHING],
        predicate: s => s.left || s.right
    },
    update: (player, level, state) => {
        let update = Object.assign({ animation: animations.RUN }, basicState);

        if (state.left) {
            update = Object.assign(moveLeft, update);
        } else if (state.right) {
            update = Object.assign(moveRight, update);
        }

        player.update(update);
    }
};

const jump = {
    match: {
        location: locations.PLATFORM,
        up: true,
        down: false,
        predicate: s => s.left || s.right,
        position: positions.DEFAULT
    },
    update: (player, level, state) => {
        let update = Object.assign({}, basicState, moveJump);

        if (state.left) {
            update = Object.assign(update, moveLeft);
        } else if (state.right) {
            update = Object.assign(update, moveRight);
        }

        update.animation = animations.RUN_JUMP;

        player.update(update);
    }
};

const jumpUpOrClimb = {
    match: {
        location: locations.PLATFORM,
        position: positions.DEFAULT,
        up: true,
        left: false,
        right: false
    },
    update: (player, level, state) => {
        const rope = nearbyRope(player, level);

        if (rope && state.xVelocity === 0) {
            getOnRope(player, rope);
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
                player.update({ xVelocity: 0 });
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
    update: (player, level, state) => {
        const rope = nearbyRope(player, level);

        if (
            rope &&
            state.position === positions.DEFAULT &&
            state.xVelocity == 0
        ) {
            getOnRope(player, rope);
        } else {
            if (state.xVelocity != 0) {
                // TODO: Automatically roll when landing on platform and pressing down with some x-momentum
                player.queueEvents(performRoll(state.direction));
            } else {
                player.update({
                    position: positions.CROUCHING,
                    animation: animations.CROUCH,
                    xVelocity: 0
                });
            }
        }
    }
};

const climbRope = {
    match: { location: locations.ROPE, predicate: s => s.up || s.down },
    update: (player, level, state) => {
        player.update({
            animation: animations.CLIMB,
            position: positions.DEFAULT,
            yVelocity: state.up ? -cfg.climbSpeed : cfg.climbSpeed
        });
    }
};

const fallOffRope = {
    match: { location: locations.ROPE, predicate: s => s.left || s.right },
    update: (player, level, state) => {
        let update = Object.assign({ location: locations.AIR }, basicState);

        if (state.left) {
            update = Object.assign(update, moveLeft);
        } else if (state.right) {
            update = Object.assign(update, moveRight);
        }

        update.yVelocity = cfg.fallSpeed;
        update.animation = animations.STAND_FALL;

        player.update(update);
    }
};

const roll = {
    match: {
        location: locations.PLATFORM,
        position: positions.DEFAULT,
        down: true,
        predicate: s => s.left || s.right
    },
    update: (player, level, state) => {
        if (state.left) {
            player.update(performRoll(directions.LEFT));
        } else if (state.right) {
            player.update(performRoll(directions.RIGHT));
        }
    }
};

const behaviors = [
    run,
    jump,
    crouchOrClimb,
    jumpUpOrClimb,
    climbRope,
    fallOffRope,
    roll
];

const handlePlayerMovement = (playerSnapshot, level) => {
    const { player, state } = playerSnapshot;

    let bestMatch = null;
    let bestScore = 0;
    let bestMatchIndex = -1;

    if (state.inputEnabled && state.anyInput) {
        for (let i = 0; i < behaviors.length; i++) {
            const behavior = behaviors[i];

            const behaviorScore = matchingProps(state, behavior.match);

            if (
                behaviorScore.actual === behaviorScore.target &&
                bestScore < behaviorScore.actual
            ) {
                bestScore = behaviorScore.actual;
                bestMatch = behavior;
                bestMatchIndex = i;
            }
        }

        if (bestMatch && bestScore > 0 && player.inputEnabled) {
            player.update(bestMatch.update, level, state);
        }
    }

    if (
        !bestMatch &&
        player.eventQueue.length === 0 &&
        !playerSnapshot.state.anyInput &&
        playerSnapshot.state.inputEnabled
    ) {
        switch (state.location) {
            case locations.PLATFORM:
                player.update({
                    animation: animations.STAND,
                    xVelocity: 0,
                    position: positions.DEFAULT
                });
                break;
            case locations.ROPE:
                player.update({
                    animation: animations.NONE,
                    position: positions.DEFAULT,
                    yVelocity: 0
                });
                break;
        }
    }

    if (
        playerSnapshot.state.location === locations.ROPE &&
        playerSnapshot.player.rope
    ) {
        stayOnRope(playerSnapshot.player);
    }
};

export { handlePlayerMovement };
