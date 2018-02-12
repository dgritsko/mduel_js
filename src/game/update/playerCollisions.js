import cfg from "../config";
import { locations } from "../../enums/locations";
import { animations } from "../../enums/animations";
import { matchingProps, now, dist, debugRender } from "../util";
import { directions } from "../../enums/directions";
import { positions } from "../../enums/positions";

const running = {
    location: locations.PLATFORM,
    xVelocity: [cfg.runSpeed, -cfg.runSpeed],
    position: positions.DEFAULT
};
const standing = {
    location: locations.PLATFORM,
    xVelocity: 0,
    position: positions.DEFAULT
};
const crouchingOrRolling = {
    location: locations.PLATFORM,
    position: [positions.CROUCHING, positions.ROLLING]
};
const climbing = { location: locations.ROPE };
const air = { location: locations.AIR };
const platform = { location: locations.PLATFORM };

const getClosingSpeed = (a0, b0, v1, v2) => {
    const add = (a, b) => {
        return [a[0] + b[0], a[1] + b[1]];
    };

    const sub = (a, b) => {
        return [a[0] - b[0], a[1] - b[1]];
    };

    const dot = (a, b) => {
        return a[0] * b[0] + a[1] * b[1];
    };

    const mag = a => {
        return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2));
    };

    //https://gamedev.stackexchange.com/a/118164/5146
    return dot(sub(v1, v2), sub(a0, b0)) / mag(sub(a0, b0));
};

const runningVsRunning = {
    match: {
        first: running,
        second: running
    },
    update: (playerSnapshot, otherPlayerSnapshot) => {
        [playerSnapshot, otherPlayerSnapshot].forEach(snapshot => {
            snapshot.update({
                yVelocity: -cfg.jumpSpeed,
                location: locations.AIR,
                xVelocity: -snapshot.state.xVelocity,
                animation: animations.BACKWARD_FALL,
                inputEnabled: false
            });
        });
    }
};

const runningVsStanding = {
    match: { first: running, second: standing },
    update: (playerSnapshot, otherPlayerSnapshot) => {
        switch (playerSnapshot.state.position) {
            case positions.CROUCHING:
            case positions.ROLLING:
                otherPlayerSnapshot.update({
                    yVelocity: -cfg.jumpSpeed,
                    animation: animations.FORWARD_FALL,
                    location: locations.AIR,
                    inputEnabled: false
                });
                break;
            default:
                const fallAnimation =
                    playerSnapshot.state.direction ===
                    otherPlayerSnapshot.state.direction
                        ? animations.FORWARD_FALL
                        : animations.BACKWARD_FALL;

                otherPlayerSnapshot.update({
                    xVelocity: playerSnapshot.state.xVelocity,
                    yVelocity: -cfg.jumpSpeed,
                    animation: fallAnimation,
                    location: locations.AIR,
                    inputEnabled: false
                });

                playerSnapshot.player.update([
                    {
                        inputEnabled: false,
                        xVelocity: 0,
                        animation: animations.STAND
                    },
                    {
                        after: now() + 100,
                        inputEnabled: true
                    }
                ]);
                break;
        }
    }
};

const runningVsCrouching = {
    match: { first: running, second: crouchingOrRolling },
    update: (playerSnapshot, otherPlayerSnapshot) => {
        playerSnapshot.update({
            location: locations.AIR,
            yVelocity: -cfg.jumpSpeed,
            animation: animations.FORWARD_FALL,
            inputEnabled: false
        });
    }
};

const crouchingVsStanding = {
    match: { first: crouchingOrRolling, second: standing },
    update: (playerSnapshot, otherPlayerSnapshot) => {
        otherPlayerSnapshot.update({
            location: locations.AIR,
            yVelocity: -cfg.jumpSpeed,
            animation: animations.FORWARD_FALL,
            inputEnabled: false
        });
    }
};

const ropeVsRope = {
    match: { first: climbing, second: climbing },
    update: (playerSnapshot, otherPlayerSnapshot) => {
        playerSnapshot.update({
            xVelocity: -cfg.runSpeed,
            direction: directions.RIGHT,
            animation: animations.BACKWARD_FALL,
            location: locations.AIR,
            inputEnabled: false
        });

        otherPlayerSnapshot.update({
            xVelocity: cfg.runSpeed,
            direction: directions.RIGHT,
            animation: animations.FORWARD_FALL,
            location: locations.AIR,
            inputEnabled: false
        });
    }
};

const airVsPlatform = {
    match: { first: air, second: platform },
    update: (playerSnapshot, otherPlayerSnapshot) => {
        if (
            playerSnapshot.state.xVelocity === 0 &&
            otherPlayerSnapshot.state.xVelocity === 0
        ) {
            otherPlayerSnapshot.update({
                yVelocity: -cfg.jumpSpeed,
                animation: animations.FORWARD_FALL,
                location: locations.AIR,
                inputEnabled: false
            });
        } else {
            if (playerSnapshot.state.x > otherPlayerSnapshot.state.x) {
                playerSnapshot.update({
                    yVelocity: -cfg.jumpSpeed,
                    location: locations.AIR,
                    animation: animations.FORWARD_FALL,
                    inputEnabled: false
                });

                const fallAnimation =
                    playerSnapshot.state.direction ===
                    otherPlayerSnapshot.state.direction
                        ? animations.BACKWARD_FALL
                        : animations.FORWARD_FALL;

                otherPlayerSnapshot.update({
                    yVelocity: -cfg.jumpSpeed,
                    location: locations.AIR,
                    xVelocity: -playerSnapshot.state.xVelocity,
                    animation: fallAnimation,
                    inputEnabled: false
                });
            } else {
                playerSnapshot.update({
                    yVelocity: -cfg.jumpSpeed,
                    location: locations.AIR,
                    xVelocity: -playerSnapshot.state.xVelocity,
                    animation: animations.BACKWARD_FALL,
                    inputEnabled: false
                });

                const fallAnimation =
                    playerSnapshot.state.direction ===
                    otherPlayerSnapshot.state.direction
                        ? animations.FORWARD_FALL
                        : animations.BACKWARD_FALL;

                otherPlayerSnapshot.update({
                    yVelocity: -cfg.jumpSpeed,
                    location: locations.AIR,
                    xVelocity: -playerSnapshot.state.xVelocity,
                    animation: fallAnimation,
                    inputEnabled: false
                });
            }
        }
    }
};

const airVsRope = {
    match: { first: air, second: climbing },
    update: (playerSnapshot, otherPlayerSnapshot) => {
        const fallAnimation =
            playerSnapshot.state.direction ===
            otherPlayerSnapshot.state.direction
                ? animations.FORWARD_FALL
                : animations.BACKWARD_FALL;

        otherPlayerSnapshot.update({
            yVelocity: -cfg.jumpSpeed,
            location: locations.AIR,
            xVelocity: playerSnapshot.state.xVelocity,
            animation: fallAnimation,
            inputEnabled: false
        });

        playerSnapshot.update({
            yVelocity: -cfg.jumpSpeed,
            location: locations.AIR,
            xVelocity: -playerSnapshot.state.xVelocity,
            animation: animations.BACKWARD_FALL,
            inputEnabled: false
        });
    }
};

const airVsAir = {
    match: { first: air, second: air },
    update: (playerSnapshot, otherPlayerSnapshot) => {
        [playerSnapshot, otherPlayerSnapshot].forEach(snapshot => {
            snapshot.update({
                //yVelocity: -cfg.jumpSpeed,
                location: locations.AIR,
                xVelocity: -snapshot.state.xVelocity,
                animation: animations.BACKWARD_FALL,
                inputEnabled: false
            });
        });
    }
};

const behaviors = [
    runningVsRunning,
    runningVsStanding,
    runningVsCrouching,
    crouchingVsStanding,
    ropeVsRope,
    airVsPlatform,
    airVsRope,
    airVsAir
];

const getRelativeState = (first, second) => {
    const distance = dist([first.x, first.y], [second.x, second.y]);

    const closingSpeed = getClosingSpeed(
        [first.x, first.y],
        [second.x, second.y],
        [first.xVelocity, first.yVelocity],
        [second.xVelocity, second.yVelocity]
    );

    const xDist = Math.abs(first.x - second.x);
    const yDist = Math.abs(first.y - second.y);

    return { distance, closingSpeed, xDist, yDist };
};

const handlePlayerCollisions = (playerSnapshot, otherPlayerSnapshots) => {
    const player = playerSnapshot.player;
    const playerState = playerSnapshot.state;

    if (player.lastPlayerCollision + 100 > now()) {
        return;
    }

    otherPlayerSnapshots.forEach(otherPlayerSnapshot => {
        const otherPlayer = otherPlayerSnapshot.player;
        const otherPlayerState = otherPlayerSnapshot.state;

        const relativeState = getRelativeState(playerState, otherPlayerState);

        if (relativeState.distance > 32) {
            return;
        }

        //debugRender(relativeState);

        if (relativeState.closingSpeed >= 0) {
            return;
        }

        for (let i = 0; i < behaviors.length; i++) {
            const behavior = behaviors[i];

            const playerProps = matchingProps(
                playerState,
                behavior.match.first || {}
            );
            const otherPlayerProps = matchingProps(
                otherPlayerState,
                behavior.match.second || {}
            );

            if (
                playerProps.actual === playerProps.target &&
                otherPlayerProps.actual === otherPlayerProps.target
            ) {
                console.log(`hit behavior ${i}`);

                behavior.update(playerSnapshot, otherPlayerSnapshot);

                player.lastPlayerCollision = now();
                otherPlayer.lastPlayerCollision = now();

                return;
            }
        }
    });
};

export { handlePlayerCollisions };
