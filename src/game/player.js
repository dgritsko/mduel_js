// import Queue from "tinyqueue";
import { now, isBool, isNumber, isString } from "./util";
// import { locations } from "../enums/locations";
// import { positions } from "../enums/positions";
import { directions } from "../enums/directions";
import { animations } from "../enums/animations";
import { collisions } from "../enums/collisions";
import { playerConfig } from "./config";

export class Player {
    constructor(spriteName, x, y, id) {
        this.id = id;

        this.sprite = game.add.sprite(x, y, spriteName);
        this.configureSprite();

        this.state = {
            lastCollision: collisions.NONE,
            crouching: false,
            rolling: false,
            unstable: false,
            justJumped: false,
            ignoreInput: false,
            x: x,
            y: y,
            flipped: false,
            touchingRope: null,
            wasTouchingRope: null,
            climbingRope: false,
            currWeapon: null,
            lastWeaponChangeTime: 0,
            weaponJustCleared: false,
            nettedStrength: 0,
            justUnwarped: false
        };

        this.input = this.configureInput(id);
        // this.eventQueue = new Queue();

        // this.applyState({
        //     // location: locations.PLATFORM,
        //     // position: positions.DEFAULT,
        //     animation: animations.STAND,
        //     inputEnabled: true
        // });
    }

    // updateEvents() {
    //     if (this.eventQueue.length === 0) {
    //         return;
    //     }

    //     const next = this.eventQueue.peek();

    //     const shouldAdvance =
    //         (typeof next.after === "undefined" &&
    //             this.sprite.animations.currentAnim.isFinished) ||
    //         next.after < now();

    //     if (shouldAdvance) {
    //         this.eventQueue.pop();
    //         this.applyState(next);
    //     }
    // }

    // clearQueue() {
    //     this.eventQueue = new Queue();
    // }

    // queueEvents(events) {
    //     if (events.length === 0) {
    //         this.clearQueue();
    //         return;
    //     }

    //     const head = events[0];
    //     const tail = events.slice(1);

    //     this.applyState(head);

    //     this.eventQueue = new Queue(tail);
    // }

    configureSprite() {
        this.sprite.anchor.setTo(0.5, 0.5);

        const { FRAMERATE } = playerConfig;

        this.sprite.animations.add(animations.STAND, [0], 0, false);
        this.sprite.animations.add(
            animations.RUN,
            [1, 2, 3, 4],
            FRAMERATE,
            true
        );

        this.sprite.animations.add(
            animations.CROUCHING,
            [6, 5],
            FRAMERATE,
            false
        );

        // this.sprite.animations.add(
        //     animations.CROUCH,
        //     [10, 5],
        //     FRAMERATE,
        //     false
        // );
        // this.sprite.animations.add(animations.CROUCHED, [5], 0, false);
        this.sprite.animations.add(
            animations.UNCROUCH,
            [5, 6],
            FRAMERATE,
            false
        );
        // this.sprite.animations.add(
        //     animations.TRANSITION,
        //     [6],
        //     FRAMERATE,
        //     false
        // );
        // this.sprite.animations.add(
        //     animations.FORWARD_ROLL,
        //     [7, 8, 9],
        //     10,
        //     false
        // );
        // this.sprite.animations.add(
        //     animations.BACKWARD_ROLL,
        //     [9, 8, 7],
        //     10,
        //     false
        // );
        // //this.sprite.animations.add(animations.JUMP, [11,12,13,14,15,16,17], 10, true);
        // this.sprite.animations.add(
        //     animations.STAND_JUMP,
        //     [6, 12, 13, 14, 15, 16, 6],
        //     10,
        //     false
        // );
        // this.sprite.animations.add(
        //     animations.RUN_JUMP,
        //     [17, 18, 19, 20],
        //     10,
        //     false
        // );
        // this.sprite.animations.add(animations.STAND_FALL, [21], 0, true);
        // this.sprite.animations.add(
        //     animations.FALL_ROLL,
        //     [22, 23, 24, 25],
        //     4,
        //     false
        // );
        // this.sprite.animations.add(
        //     animations.FORWARD_FALL,
        //     [26, 27],
        //     FRAMERATE / 2,
        //     true
        // );
        // this.sprite.animations.add(
        //     animations.BACKWARD_FALL,
        //     [28, 29],
        //     FRAMERATE / 2,
        //     true
        // );
        // this.sprite.animations.add(animations.SHOOT, [30, 31], 2, false);
        // this.sprite.animations.add(animations.GRENADE_TOSS, [32, 33], 3, true);
        // this.sprite.animations.add(animations.PUCK_TOSS, [34, 35], 2, true);
        // this.sprite.animations.add(animations.PARACHUTE, [36], 0, false);
        // this.sprite.animations.add(animations.HOOK, [37, 38], 2, true); // not sure if this is the right animation name
        // this.sprite.animations.add(
        //     animations.CLIMB,
        //     [39, 40, 41, 42, 43],
        //     FRAMERATE,
        //     true
        // );
        // this.sprite.animations.add(animations.VICTORY, [44, 45], 2, true);
        // this.sprite.animations.add(animations.ROPE_VICTORY, [46, 47], 2, true);
        // this.sprite.animations.add(
        //     animations.DISINTEGRATE,
        //     [48, 49, 50, 51, 52, 53],
        //     FRAMERATE,
        //     true
        // );
        // this.sprite.animations.add(
        //     animations.VAPORIZE,
        //     [54, 55, 56, 57],
        //     FRAMERATE,
        //     true
        // );
        // this.sprite.animations.add(
        //     animations.TAUNT,
        //     [58, 59, 60, 61],
        //     FRAMERATE,
        //     true
        // );
        // this.sprite.animations.add(animations.FLEX, [62, 63], 2, false);
        // this.sprite.animations.add(animations.MAGNET, [64, 65], 2, false);
        // this.sprite.animations.add(animations.EMPTY, [66], 0, false);
        // this.sprite.animations.add(animations.TRAPPED, [67], 0, false);

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

        this.setBounds(playerConfig.STANDING_BOUNDS);

        this.sprite.body.maxVelocity = new Phaser.Point(
            playerConfig.RUN_SPEED,
            playerConfig.TERMINAL_VELOCITY
        );
    }

    setBounds(bounds) {
        const { top, right, bottom, left } = bounds;

        const width = Math.abs(right) + Math.abs(left);
        const height = Math.abs(top) + Math.abs(bottom);

        this.sprite.body.setSize(
            width,
            height,
            playerConfig.SPRITE_WIDTH / 2 + left,
            playerConfig.SPRITE_HEIGHT / 2 + top
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

    // getState() {
    //     return {
    //         x: this.sprite.x,
    //         y: this.sprite.y,
    //         inputEnabled: this.inputEnabled,
    //         xVelocity: this.sprite.body.velocity.x,
    //         yVelocity: this.sprite.body.velocity.y,
    //         location: this.location,
    //         position: this.position,
    //         direction:
    //             this.sprite.scale.x < 0 ? directions.LEFT : directions.RIGHT,
    //         animation: this.sprite.animations.name
    //     };
    // }

    // getDebugState() {
    //     const state = this.getState();

    //     const fixValue = (k, d) => {
    //         const entries = Object.entries(d);

    //         state[k] = entries
    //             .filter(e => e[1] === state[k])[0][0]
    //             .toLowerCase();
    //     };

    //     // fixValue("location", locations);
    //     // fixValue("position", positions);
    //     fixValue("direction", directions);

    //     return state;
    // }

    getInput() {
        const left = this.input.left.isDown;
        const right = this.input.right.isDown;
        const up = this.input.up.isDown;
        const down = this.input.down.isDown;
        const anyInput = left || right || up || down;

        const current = {
            left,
            right,
            up,
            down,
            anyInput
        };

        const newPresses = {};

        const makeKey = k =>
            `new${k.substring(0, 1).toUpperCase()}${k.substring(1)}`;
        Object.keys(this.prevInput || []).forEach(k => {
            newPresses[makeKey(k)] = !this.prevInput[k] && current[k];
        });

        this.prevInput = Object.assign({}, current);

        return Object.assign({}, current, newPresses);
    }

    getState() {
        const position = { x: this.sprite.x, y: this.sprite.y };

        return Object.assign({}, this.state, position);
    }

    // update(toUpdate, level, state) {
    //     this.clearQueue();

    //     if (Array.isArray(toUpdate)) {
    //         this.queueEvents(toUpdate);
    //     } else if (typeof toUpdate === "function") {
    //         toUpdate(this, level, state);
    //     } else if (typeof toUpdate === "object") {
    //         this.applyState(toUpdate);
    //     }
    // }

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

        // if (isNumber(location)) {
        //     this.location = location;

        //     switch (location) {
        //         case locations.ROPE:
        //             this.sprite.body.allowGravity = false;
        //             break;
        //         default:
        //             this.sprite.body.allowGravity = true;
        //             break;
        //     }
        // }

        // if (isNumber(position)) {
        //     this.position = position;
        // }

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

    handleInput() {
        const input = this.getInput();
        const state = this.getState();

        // //weapon animation refreshes
        // if (inputInterrupt == 0 && forceAnimUpdate)
        // {
        //     if (isOnRope()) {
        //         if (vy > 0)
        //             playClimbingDown();
        //         else
        //             playClimbingUp();
        //     }
        //     else if (isOnGround())
        //         playRunning();
        //     else if (bUnstable)
        //         playPushedForward();
        //     else
        //         playFalling();
        //     if (hl || hr)
        //         setFlipped(hl, getFlippedv());
        //     forceAnimUpdate = false;
        // }
        // //netted physics
        // if (nettedStrength > 0)
        // {
        //     handleNetted(nu);
        //     return;
        // }
        if (this.sprite.body.left <= 0) {
            // bounce off left wall
            //     setFlipped(true);
            //     bounce();
        } else if (this.sprite.body.right >= game.world.width) {
            // bounce off right wall
            //     setFlipped(false);
            //     bounce();
        } else if (state.inputEnabled || true) {
            //regular controls
            if (false) {
                //     if (bClimbingRope)
                //     {
                //         if (touchingRope == NULL)
                //         {
                //             vy = 0;
                //             vx = (hr - hl) * WALKSPEED;
                //             bClimbingRope = false;
                //             justfell();
                //         } else {
                //             vy = (hd - hu) * CLIMBSPEED;
                //             //don't allow to climb off rope via up/down keys
                //             if (touchingRope->childRopes[touchingRope->childRopes.size()-1]->getBottom() < getBottom() && vy > 0)
                //                 vy = 0;
                //             else if (touchingRope->childRopes[0]->getTop() > getTop() && vy < 0)
                //                 vy = 0;
                //             if (nd)
                //                 playClimbingDown();
                //             else if (nu)
                //                 playClimbingUp();
                //             if (vy == 0) setFrame(frame);
                //             if (hr || hl)	//jump off!
                //             {
                //                 vx = (hr - hl) * WALKSPEED;
                //                 vy = 0;
                //                 bClimbingRope = false;
                //                 setFlipped(hl);
                //                 justfell();
                //             }
                //         }
            } else if (true) {
                // if (!wasOnGround) {
                //  justlanded(hr, hl);	//reset collision bounds, etc
                // }
                //         bUnstable = false;
                //         if (touchingRope != NULL && (hu || nu || hd || nd) && !(hl || hr) && !bCrouching && !bRolling)
                //         {
                //             climbRope(hd);
                //         } else if (bRolling)
                //         {
                //             if (arbitraryAnim == 0)	//anim finished, so stop moving (PROBABLY A BAD IDEA)
                //             {
                //                 bRolling = false;
                //                 bCrouching = true;
                //                 //recovered from a roll, so reset collision & warp usage state
                //                 lastCollision = CS_NONE;
                //                 bJustUnwarped = false;
                //             }
                //         } else if (bCrouching)
                //         {
                //             vx = 0;
                //             if (!hd)
                //                 uncrouch(hr, hl);
                //         } else {
                //             vx = (hr - hl) * WALKSPEED;		//walking speed

                if (state.crouching) {
                    this.sprite.body.velocity.x = 0;
                    if (!input.down) {
                        this.uncrouch(input.right, input.left);
                    }
                } else {
                    const asInt = b => (b ? 1 : 0);

                    this.sprite.body.velocity.x =
                        (asInt(input.right) - asInt(input.left)) *
                        playerConfig.RUN_SPEED;

                    if (input.newRight) {
                        this.sprite.scale.setTo(1, 1);
                        this.sprite.animations.play(animations.RUN);
                    } else if (input.newLeft) {
                        this.sprite.scale.setTo(-1, 1);
                        this.sprite.animations.play(animations.RUN);
                    } else if (input.down) {
                        this.crouch();
                    } else if (!input.right && !input.left) {
                        this.sprite.animations.play(animations.STAND);
                    }

                    if (input.newUp) {
                        this.jump();
                    }
                }
            } else {
                //     } else {
                //         if (wasOnGround() && !justJumped)
                //             justfell();
                //         justJumped = false;
                //         if (usingChut())		//parachut midair controls
                //         {
                //             vx = (vx==0 && !hr && !hl ? 0 : (flippedh ? WALKSPEED*-1 : WALKSPEED));
                //             //vx = (flippedh ? WALKSPEED*-1 : WALKSPEED);
                //             //vx = (hr - hl) * WALKSPEED;
                //             if (nr)
                //                 setFlipped(false);
                //             else if (nl)
                //                 setFlipped(true);
                //         }
                //     }
            }
        }
        // //weapon stuffs
        // if (currWeapon != NULL)
        // {
        //     if (nf && !currWeapon->isFiring())
        //         currWeapon->fire();
        //     if (!hf && currWeapon->isFiring())
        //         currWeapon->stopFiring();
        // }
    }

    crouch() {
        // TODO
        // if (!isOnGround()) return false;

        this.state.crouching = true;

        if (this.sprite.body.velocity.x === 0 && !this.state.unstable) {
            this.applyState({ animation: animations.CROUCHING });
        } else {
            this.roll();
        }

        this.setBounds(playerConfig.CROUCHING_BOUNDS);
    }

    uncrouch(right, left) {
        this.state.crouching = false;

        this.setBounds(playerConfig.STANDING_BOUNDS);

        //setFlipped(hr - hl == 0 ? flippedh : hr - hl < 0, flippedv);

        // TODO
        this.applyState({ animation: animations.RUN });
    }
}
