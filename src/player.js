import Queue from 'tinyqueue';
import { now } from './util/util';

export class Player {
    constructor(spriteName, x, y, id) {
        this.sprite = game.add.sprite(x, y, spriteName);
        this.configureSprite();

        this.input = this.configureInput(id);

        this.sprite.animations.play('stand');

        this.eventQueue = new Queue();

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

        this.location = locations.PLATFORM;
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

        this.sprite.animations.add('stand', [0], 0, false);
        this.sprite.animations.add('run', [1,2,3,4], 12, true);
        this.sprite.animations.add('crouch', [10,5], 15, false);
        this.sprite.animations.add('uncrouch', [5,6], 12, false);
        this.sprite.animations.add('land', [6], 0, false);
        this.sprite.animations.add('forward_roll', [7,8,9], 10, false);
        this.sprite.animations.add('backward_roll', [9,8,7], 10, false);
        //this.sprite.animations.add('jump', [11,12,13,14,15,16,17], 10, true);
        this.sprite.animations.add('stand_jump', [6,12,13,14,15,16, 6], 10, false);
        this.sprite.animations.add('run_jump', [17,18,19,20], 4, false);
        this.sprite.animations.add('stand_fall', [21], 0, true);
        this.sprite.animations.add('fall_roll', [22,23,24,25], 4, false);
        this.sprite.animations.add('forward_fall', [26,27], 10, true);
        this.sprite.animations.add('backward_fall', [28,29], 10, true);
        this.sprite.animations.add('shoot', [30,31], 2, false);
        this.sprite.animations.add('grenade_toss', [32,33], 3, true);
        this.sprite.animations.add('puck_toss', [34,35], 2, true);
        this.sprite.animations.add('parachute', [36], 0, false);
        this.sprite.animations.add('hook', [37,38], 2, true); // not sure if this is the right animation name
        this.sprite.animations.add('climb', [39,40,41,42,43], 10, true);
        this.sprite.animations.add('victory', [44,45], 2, true);
        this.sprite.animations.add('rope_victory', [46,47], 2, true);
        this.sprite.animations.add('disintegrate', [48,49,50,51,52,53], 10, true);
        this.sprite.animations.add('vaporize', [54,55,56,57], 10, true);
        this.sprite.animations.add('taunt', [58,59,60,61], 10, true);
        this.sprite.animations.add('flex', [62,63], 2, false);
        this.sprite.animations.add('magnet', [64,65], 2, false);
        this.sprite.animations.add('empty', [66], 0, false);
        this.sprite.animations.add('trapped', [67], 0, false);

        game.physics.enable(this.sprite);

        this.sprite.body.setSize(this.sprite.width / 2, this.sprite.height - 16, this.sprite.width / 4, 8);
    }

    configureInput(id) {
        if (id === 1) {
            return {
                up: game.input.keyboard.addKey(Phaser.Keyboard.W),
                down: game.input.keyboard.addKey(Phaser.Keyboard.S),
                left: game.input.keyboard.addKey(Phaser.Keyboard.A),
                right: game.input.keyboard.addKey(Phaser.Keyboard.D)
            }
        } else if (id === 2) {
            return {
                up: game.input.keyboard.addKey(Phaser.Keyboard.I),
                down: game.input.keyboard.addKey(Phaser.Keyboard.K),
                left: game.input.keyboard.addKey(Phaser.Keyboard.J),
                right: game.input.keyboard.addKey(Phaser.Keyboard.L)
            }
        } else {
            return game.input.keyboard.createCursorKeys();
        }
    }

    getState() {
        return {
            x: this.sprite.x,
            y: this.sprite.y,
            inputEnabled: true,
            gravityEnabled: true,
            xVelocity: this.sprite.body.velocity.x,
            yVelocity: this.sprite.body.velocity.y,
            location: this.location,
            position: this.position
        }
    }

    applyState({ x, y, inputEnabled, gravityEnabled, xVelocity, yVelocity, location, position }) {
        const isNumber = value => typeof(value) === 'number';
        const isBool = value => typeof(value) === 'boolean';

        if (isNumber(x)) {
            this.sprite.x = x;
        }

        if (isNumber(y)) {
            this.sprite.y = y;
        }

        if (isBool(inputEnabled)) {
            // TODO 
        }

        if (isBool(gravityEnabled)) {
            // TODO 
        }

        if (isNumber(xVelocity)) {
            // TODO 
        }

        if (isNumber(yVelocity)) {
            // TODO 
        }

        if (isNumber(location)) {
            // TODO 
        }

        if (isNumber(position)) {
            // TODO
        }
    }
}

export const locations = {
    PLATFORM: 0,
    ROPE: 1,
    AIR: 2,
    PIT: 3
}