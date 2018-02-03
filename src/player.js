import Queue from 'tinyqueue';
import { now, isBool, isNumber, isString } from './util/util';
import { locations } from './enums/locations';
import { positions } from './enums/positions';
import { directions } from './enums/directions';
import { animations } from './enums/animations';

export class Player {
    constructor(spriteName, x, y, id) {
        this.sprite = game.add.sprite(x, y, spriteName);
        this.configureSprite();

        this.input = this.configureInput(id);
        this.eventQueue = new Queue();

        this.applyState({
            location: locations.PLATFORM,
            position: positions.DEFAULT,
            animation: 'stand',
            inputEnabled: true
        });
    }

    updateEvents() {
        const next = this.eventQueue.peek();
        if (next && next.time <= now()) {
            this.eventQueue.pop();
            next.event();
        }
    }

    configureSprite() {
        this.sprite.anchor.setTo(0.5);

        this.sprite.animations.add(animations.STAND, [0], 0, false);
        this.sprite.animations.add(animations.RUN, [1,2,3,4], 12, true);
        this.sprite.animations.add(animations.CROUCH, [10,5], 15, false);
        this.sprite.animations.add(animations.UNCROUCH, [5,6], 12, false);
        this.sprite.animations.add(animations.LAND, [6], 0, false);
        this.sprite.animations.add(animations.FORWARD_ROLL, [7,8,9], 10, false);
        this.sprite.animations.add(animations.BACKWARD_ROLL, [9,8,7], 10, false);
        //this.sprite.animations.add(animations.JUMP, [11,12,13,14,15,16,17], 10, true);
        this.sprite.animations.add(animations.STAND_JUMP, [6,12,13,14,15,16, 6], 10, false);
        this.sprite.animations.add(animations.RUN_JUMP, [17,18,19,20], 4, false);
        this.sprite.animations.add(animations.STAND_FALL, [21], 0, true);
        this.sprite.animations.add(animations.FALL_ROLL, [22,23,24,25], 4, false);
        this.sprite.animations.add(animations.FORWARD_FALL, [26,27], 10, true);
        this.sprite.animations.add(animations.BACKWARD_FALL, [28,29], 10, true);
        this.sprite.animations.add(animations.SHOOT, [30,31], 2, false);
        this.sprite.animations.add(animations.GRENADE_TOSS, [32,33], 3, true);
        this.sprite.animations.add(animations.PUCK_TOSS, [34,35], 2, true);
        this.sprite.animations.add(animations.PARACHUTE, [36], 0, false);
        this.sprite.animations.add(animations.HOOK, [37,38], 2, true); // not sure if this is the right animation name
        this.sprite.animations.add(animations.CLIMB, [39,40,41,42,43], 10, true);
        this.sprite.animations.add(animations.VICTORY, [44,45], 2, true);
        this.sprite.animations.add(animations.ROPE_VICTORY, [46,47], 2, true);
        this.sprite.animations.add(animations.DISINTEGRATE, [48,49,50,51,52,53], 10, true);
        this.sprite.animations.add(animations.VAPORIZE, [54,55,56,57], 10, true);
        this.sprite.animations.add(animations.TAUNT, [58,59,60,61], 10, true);
        this.sprite.animations.add(animations.FLEX, [62,63], 2, false);
        this.sprite.animations.add(animations.MAGNET, [64,65], 2, false);
        this.sprite.animations.add(animations.EMPTY, [66], 0, false);
        this.sprite.animations.add(animations.TRAPPED, [67], 0, false);

        // Jump up
        //this.sprite.animations.add('custom1', [6, 12, 13, 14, 15, 16, 6], 8, true);
        
        // Jump forward
        // 17, 18, 19, 20

        // Jump start/end, land from fall/jump
        // 6

        // Backward roll (land from backward fall)
        // 9, 8, 7

        // Forward roll
        // 7, 8, 9

        // Crouch down
        // 10, 5

        // Uncrouch
        // 5, 6

        // Hit platform
        // 7, 8 

        game.physics.enable(this.sprite);

        this.sprite.body.setSize(this.sprite.width / 2, this.sprite.height - 16, this.sprite.width / 4, 8);
    }

    configureInput(id) {
        if (id === 1) {
            return {
                action: game.input.keyboard.addKey(Phaser.Keyboard.Q),
                up: game.input.keyboard.addKey(Phaser.Keyboard.W),
                down: game.input.keyboard.addKey(Phaser.Keyboard.S),
                left: game.input.keyboard.addKey(Phaser.Keyboard.A),
                right: game.input.keyboard.addKey(Phaser.Keyboard.D)
            }
        } else if (id === 2) {
            return {
                action: game.input.keyboard.addKey(Phaser.Keyboard.U),
                up: game.input.keyboard.addKey(Phaser.Keyboard.I),
                down: game.input.keyboard.addKey(Phaser.Keyboard.K),
                left: game.input.keyboard.addKey(Phaser.Keyboard.J),
                right: game.input.keyboard.addKey(Phaser.Keyboard.L)
            }
        } else {
            const input = game.input.keyboard.createCursorKeys();
            input.action = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            return input;
        }
    }

    getState() {
        return {
            x: this.sprite.x,
            y: this.sprite.y,
            inputEnabled: this.inputEnabled,
            gravityEnabled: this.sprite.body.moves,
            xVelocity: this.sprite.body.velocity.x,
            yVelocity: this.sprite.body.velocity.y,
            location: this.location,
            position: this.position,
            direction: this.sprite.scale.x < 0 ? directions.LEFT : directions.RIGHT,
            animation: this.sprite.animations.name
        }
    }

    applyState({ x, y, inputEnabled, gravityEnabled, xVelocity, yVelocity, location, position, direction, animation }) {
        if (isNumber(x)) {
            this.sprite.x = x;
        }

        if (isNumber(y)) {
            this.sprite.y = y;
        }

        if (isBool(inputEnabled)) {
            this.inputEnabled = inputEnabled;
        }

        if (isBool(gravityEnabled)) {
            this.sprite.body.moves = gravityEnabled;
        }

        if (isNumber(xVelocity)) {
            this.sprite.body.velocity.x = xVelocity;
        }

        if (isNumber(yVelocity)) {
            this.sprite.body.velocity.y = yVelocity;
        }

        if (isNumber(location)) {
            this.location = location;
        }

        if (isNumber(position)) {
            this.position = position;
        }

        if (isNumber(direction)) {
            switch (direction) {
                case directions.LEFT:
                    this.sprite.scale.setTo(-1, 1);
                    break;
                case directions.RIGHT:
                    this.sprite.scale.setTo(1, 1);
                    break;
            }
        }

        if (isString(animation)) {
            if (animation === 'none') {
                this.sprite.animations.stop();
            } else {
                this.sprite.animations.play(animation);
            }
        }
    }
}
