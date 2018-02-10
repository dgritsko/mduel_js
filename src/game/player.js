import Queue from "tinyqueue";
import { now, isBool, isNumber, isString } from "./util";
import { locations } from "../enums/locations";
import { positions } from "../enums/positions";
import { directions } from "../enums/directions";
import { animations } from "../enums/animations";
import cfg from "./config";

export class Player {
    constructor(spriteName, x, y, id) {
        this.id = id;

        this.sprite = game.add.sprite(x, y, spriteName);
        this.configureSprite();

        this.input = this.configureInput(id);
        this.eventQueue = new Queue();

        this.applyState({
            location: locations.PLATFORM,
            position: positions.DEFAULT,
            animation: "stand",
            inputEnabled: true
        });
    }

    updateEvents() {
        if (this.eventQueue.length === 0) {
            return;
        }

        const next = this.eventQueue.peek();

        const shouldAdvance =
            (typeof next.after === "undefined" &&
                this.sprite.animations.currentAnim.isFinished) ||
            next.after < now();

        if (shouldAdvance) {
            this.eventQueue.pop();
            this.applyState(next);
        }
    }

    clearQueue() {
        this.eventQueue = new Queue();
    }

    queueEvents(events) {
        if (events.length === 0) {
            this.clearQueue();
            return;
        }

        const head = events[0];
        const tail = events.slice(1);

        this.applyState(head);

        this.eventQueue = new Queue(tail);
    }

    configureSprite() {
        this.sprite.anchor.setTo(0.5);

        const framerate = 12;

        this.sprite.animations.add(animations.STAND, [0], 0, false);
        this.sprite.animations.add(
            animations.RUN,
            [1, 2, 3, 4],
            framerate,
            true
        );
        this.sprite.animations.add(
            animations.CROUCH,
            [10, 5],
            framerate,
            false
        );
        this.sprite.animations.add(animations.CROUCHED, [5], 0, false);
        this.sprite.animations.add(
            animations.UNCROUCH,
            [5, 6],
            framerate,
            false
        );
        this.sprite.animations.add(
            animations.TRANSITION,
            [6],
            framerate,
            false
        );
        this.sprite.animations.add(
            animations.FORWARD_ROLL,
            [7, 8, 9],
            10,
            false
        );
        this.sprite.animations.add(
            animations.BACKWARD_ROLL,
            [9, 8, 7],
            10,
            false
        );
        //this.sprite.animations.add(animations.JUMP, [11,12,13,14,15,16,17], 10, true);
        this.sprite.animations.add(
            animations.STAND_JUMP,
            [6, 12, 13, 14, 15, 16, 6],
            10,
            false
        );
        this.sprite.animations.add(
            animations.RUN_JUMP,
            [17, 18, 19, 20],
            10,
            false
        );
        this.sprite.animations.add(animations.STAND_FALL, [21], 0, true);
        this.sprite.animations.add(
            animations.FALL_ROLL,
            [22, 23, 24, 25],
            4,
            false
        );
        this.sprite.animations.add(
            animations.FORWARD_FALL,
            [26, 27],
            framerate / 2,
            true
        );
        this.sprite.animations.add(
            animations.BACKWARD_FALL,
            [28, 29],
            framerate / 2,
            true
        );
        this.sprite.animations.add(animations.SHOOT, [30, 31], 2, false);
        this.sprite.animations.add(animations.GRENADE_TOSS, [32, 33], 3, true);
        this.sprite.animations.add(animations.PUCK_TOSS, [34, 35], 2, true);
        this.sprite.animations.add(animations.PARACHUTE, [36], 0, false);
        this.sprite.animations.add(animations.HOOK, [37, 38], 2, true); // not sure if this is the right animation name
        this.sprite.animations.add(
            animations.CLIMB,
            [39, 40, 41, 42, 43],
            framerate,
            true
        );
        this.sprite.animations.add(animations.VICTORY, [44, 45], 2, true);
        this.sprite.animations.add(animations.ROPE_VICTORY, [46, 47], 2, true);
        this.sprite.animations.add(
            animations.DISINTEGRATE,
            [48, 49, 50, 51, 52, 53],
            framerate,
            true
        );
        this.sprite.animations.add(
            animations.VAPORIZE,
            [54, 55, 56, 57],
            framerate,
            true
        );
        this.sprite.animations.add(
            animations.TAUNT,
            [58, 59, 60, 61],
            framerate,
            true
        );
        this.sprite.animations.add(animations.FLEX, [62, 63], 2, false);
        this.sprite.animations.add(animations.MAGNET, [64, 65], 2, false);
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

        this.sprite.body.setSize(
            this.sprite.width / 2,
            this.sprite.height - 16,
            this.sprite.width / 4,
            8
        );

        this.sprite.body.maxVelocity = new Phaser.Point(
            cfg.runSpeed,
            cfg.gravity
        );
    }

    configureInput(id) {
        if (id === 1) {
            return {
                action: game.input.keyboard.addKey(Phaser.Keyboard.Q),
                up: game.input.keyboard.addKey(Phaser.Keyboard.W),
                down: game.input.keyboard.addKey(Phaser.Keyboard.S),
                left: game.input.keyboard.addKey(Phaser.Keyboard.A),
                right: game.input.keyboard.addKey(Phaser.Keyboard.D)
            };
        } else if (id === 2) {
            return {
                action: game.input.keyboard.addKey(Phaser.Keyboard.U),
                up: game.input.keyboard.addKey(Phaser.Keyboard.I),
                down: game.input.keyboard.addKey(Phaser.Keyboard.K),
                left: game.input.keyboard.addKey(Phaser.Keyboard.J),
                right: game.input.keyboard.addKey(Phaser.Keyboard.L)
            };
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
            xVelocity: this.sprite.body.velocity.x,
            yVelocity: this.sprite.body.velocity.y,
            location: this.location,
            position: this.position,
            direction:
                this.sprite.scale.x < 0 ? directions.LEFT : directions.RIGHT,
            animation: this.sprite.animations.name
        };
    }

    getDebugState() {
        const state = this.getState();

        const fixValue = (k, d) => {
            const entries = Object.entries(d);

            state[k] = entries
                .filter(e => e[1] === state[k])[0][0]
                .toLowerCase();
        };

        fixValue("location", locations);
        fixValue("position", positions);
        fixValue("direction", directions);

        return state;
    }

    getInput() {
        const left = this.input.left.isDown;
        const right = this.input.right.isDown;
        const up = this.input.up.isDown;
        const down = this.input.down.isDown;
        const anyInput = left || right || up || down;

        return {
            left,
            right,
            up,
            down,
            anyInput
        };
    }

    update(toUpdate, level, state) {
        this.clearQueue();

        if (Array.isArray(toUpdate)) {
            this.queueEvents(toUpdate);
        } else if (typeof toUpdate === "function") {
            toUpdate(this, level, state);
        } else if (typeof toUpdate === "object") {
            this.applyState(toUpdate);
        }
    }

    applyState(newState) {
        const {
            x,
            y,
            dx,
            dy,
            inputEnabled,
            xVelocity,
            yVelocity,
            location,
            position,
            direction,
            animation
        } = newState;
        if (isNumber(x)) {
            this.sprite.x = x;
        }

        if (isNumber(y)) {
            this.sprite.y = y;
        }

        if (isNumber(dx)) {
            this.sprite.x += dx;
        }

        if (isNumber(dy)) {
            this.sprite.y += dy;
        }

        if (isBool(inputEnabled)) {
            this.inputEnabled = inputEnabled;
        }

        if (isNumber(xVelocity)) {
            this.sprite.body.velocity.x = xVelocity;
        }

        if (isNumber(yVelocity)) {
            this.sprite.body.velocity.y = yVelocity;
        }

        if (isNumber(location)) {
            this.location = location;

            switch (location) {
                case locations.ROPE:
                    this.sprite.body.allowGravity = false;
                    break;
                default:
                    this.sprite.body.allowGravity = true;
                    break;
            }
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
            if (animation === animations.NONE) {
                this.sprite.animations.stop();
            } else if (
                this.sprite.animations.currentAnim.name !== animation ||
                this.sprite.animations.currentAnim.loop
            ) {
                this.sprite.animations.play(animation);
            }
        }
    }
}
