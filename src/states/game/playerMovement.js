import { locations } from '../../enums/locations';
import cfg from '../../gameConfig';

const apply = (attr) => player => {
    if (attr.animation) {
        player.sprite.animations.play(attr.animation);
    } else {
        player.sprite.animations.stop();
    }

    if (attr.direction === 'left') {
        player.sprite.scale.setTo(-1, 1);
    } else if (attr.direction === 'right') {
        player.sprite.scale.setTo(1, 1);
    }

    if (typeof(attr.xVel) !== 'undefined') {
        player.sprite.body.velocity.x = attr.xVel;
    }

    if (typeof(attr.yVel) !== 'undefined') {
        player.sprite.body.velocity.y = attr.yVel;
    }

    if (typeof(attr.yAdjustment) !== 'undefined') {
        player.sprite.y = player.sprite.y + attr.yAdjustment;
    }

    if (typeof(attr.location) !== 'undefined') {
        player.location = attr.location;
    }

    if (attr.onRope) {
        player.sprite.body.moves = false;

        if (player.rope) {
            player.sprite.y = Math.max(player.sprite.y, player.rope.top.y + player.sprite.offsetY - 8);
            player.sprite.y = Math.min(player.sprite.y, player.rope.bottom.y - player.sprite.offsetY);
        }
    } else {
        player.sprite.body.moves = true;
    }
};

const climbUpRope = {
    match: { up: true, location: locations.ROPE },
    act: apply({ animation: 'climb', onRope: true, yAdjustment: -cfg.climbRate })
};

const climbDownRope = {
    match: { down: true, location: locations.ROPE },
    act: apply({ animation: 'climb', onRope: true, yAdjustment: cfg.climbRate })
};

const fallOffRopeRight = {
    match: { right: true, location: locations.ROPE },
    act: apply({ animation: 'stand_fall', location: locations.AIR, xVel: cfg.runSpeed, direction: 'right' })
};

const fallOffRopeLeft = {
    match: { left: true, location: locations.ROPE },
    act: apply({ animation: 'stand_fall', location: locations.AIR, xVel: -cfg.runSpeed, direction: 'left' })
};

const hangOnRope = {
    match: { location: locations.ROPE },
    act:
        p => {
            p.sprite.animations.stop();
        }
};

const jumpLeft = {  
    match: { up: true, left: true, location: locations.PLATFORM },
    act: apply({ animation: 'run_jump', direction: 'left', xVel: -cfg.runSpeed, yVel: -cfg.jumpSpeed, location: locations.AIR })
};

const jumpRight = {  
    match: { up: true, right: true, location: locations.PLATFORM },
    act: apply({ animation: 'run_jump', direction: 'right', xVel: cfg.runSpeed, yVel: -cfg.jumpSpeed, location: locations.AIR })
};

const runLeft = { 
    match: { left: true, location: locations.PLATFORM },
    act: apply({ animation: 'run', direction: 'left', xVel: -cfg.runSpeed })
};

const runRight = { 
    match: { right: true, location: locations.PLATFORM }, 
    act: apply({ animation: 'run', direction: 'right', xVel: cfg.runSpeed })
};

const rollLeft = {
    match: { down: true, left: true, location: locations.PLATFORM, xVel: -cfg.runSpeed },
    act: 
        player => {
            const name = 'roll';

            if (player.sprite.animations.currentAnim.name !== name) {
                player.sprite.animations.play(name);
            } else if (player.sprite.animations.currentAnim.isFinished) {
                player.sprite.body.velocity.x = 0;
            }
        }
};

const rollRight = {
    match: { down: true, right: true, location: locations.PLATFORM, xVel: cfg.runSpeed },
    act: 
        p => {
            const name = 'roll';

            if (p.sprite.animations.currentAnim.name !== name) {
                p.sprite.animations.play(name);
            } else if (p.sprite.animations.currentAnim.isFinished) {
                p.sprite.body.velocity.x = 0;
            }
        }
};

const jumpUpOrClimb = {
    match: { up: true, location: locations.PLATFORM },
    act:
        (player, level) => {
            const x = player.sprite.x;
            const y = player.sprite.y + player.sprite.offsetY;
            const ropes = level.ropes.filter(r => (r.x >= (x - cfg.ropeDist) && r.x <= (x + cfg.ropeDist))).filter(r => (y >= r.y && y <= (r.y + r.height + cfg.ropeDist)));

            if (ropes.length > 0) {
                player.location = locations.ROPE;
                player.sprite.x = ropes[0].x;
                player.rope = { top: new Phaser.Point(ropes[0].x, ropes[0].y), bottom: new Phaser.Point(ropes[0].x, ropes[0].y + ropes[0].height) };
            } else {
                apply({ yVel: -cfg.jumpSpeed, animation: 'jump', location: locations.AIR })(player);
            }
        }
};

const crouch = {
    match: { down: true, location: locations.PLATFORM, xVel: 0 },
    act: player => {

    }
}

const crouchOrClimb = {
    match: { down: true, right: false, left: false, location: locations.PLATFORM, xVel: 0 },
    act:
        (player, level) => {
            const x = player.sprite.x;
            const y = player.sprite.y + player.sprite.offsetY;
            const ropes = level.ropes.filter(r => (r.x >= (x - cfg.ropeDist) && r.x <= (x + cfg.ropeDist))).filter(r => (y >= r.y && y <= (r.y + r.height + cfg.ropeDist)));

            if (ropes.length > 0) {
                player.location = locations.ROPE;
                player.sprite.x = ropes[0].x;
                player.rope = { top: new Phaser.Point(ropes[0].x, ropes[0].y), bottom: new Phaser.Point(ropes[0].x, ropes[0].y + ropes[0].height) };
            } else {
                const name = 'crouch';

                if (player.sprite.animations.currentAnim.name !== name) {
                    player.sprite.animations.play(name);
                } else if (player.sprite.animations.currentAnim.isFinished) {
                    player.sprite.body.velocity.x = 0;
                }
            }
        }
};

const stand = { 
    match: { location: locations.PLATFORM },
    act: apply({ animation: 'stand', xVel: 0 })
};

const behaviors = [
    climbUpRope,
    climbDownRope,
    fallOffRopeRight,
    fallOffRopeLeft,
    hangOnRope,
    jumpLeft,
    jumpRight,
    runLeft,
    runRight,
    rollLeft,
    rollRight,
    jumpUpOrClimb,
    crouch,
    crouchOrClimb,
    stand
];

const getCurrentInput = (player) => {
    return { 
        left: player.input.left.isDown,
        right: player.input.right.isDown,
        up: player.input.up.isDown,
        down: player.input.down.isDown,
        location: player.location,
        xVel: player.sprite.body.velocity.x
    };
};

const handlePlayerMovement = (player, level) => {
    let bestMatch = null;
    let bestScore = 0;
    let bestMatchIndex = -1;

    const currentInput = getCurrentInput(player);

    for (let i = 0; i < behaviors.length; i++) {
        const behavior = behaviors[i];

        let isMatch = true;
        let matchScore = 0;

        const checkProps = x => {
            if (typeof(behavior.match[x]) === 'undefined') {
                return;
            } 
            
            if (behavior.match[x] !== currentInput[x]) {
                isMatch = false;
            } else {
                matchScore++;
            }
        };

        checkProps('left');
        checkProps('right');
        checkProps('up');
        checkProps('down');
        checkProps('location');
        checkProps('xVel');

        if (isMatch && bestScore < matchScore) {
            bestScore = matchScore;
            bestMatch = behavior;
            bestMatchIndex = i;
        }
    }

    if (bestMatch && bestScore > 0) {
        bestMatch.act(player, level);
    }
}

export { handlePlayerMovement };