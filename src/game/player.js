// import Queue from "tinyqueue";
import { now, isBool, isNumber, isString, debugRender } from "./util";
// import { locations } from "../enums/locations";
// import { positions } from "../enums/positions";
// import { directions } from "../enums/directions";
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
            justUnwarped: false,
            inputInterrupt: 0
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
        this.sprite.animations.add(
            animations.STAND_JUMP,
            [6, 12, 13, 14, 15, 16, 17, 21],
            FRAMERATE,
            false
        );
        this.sprite.animations.add(
            animations.RUN_JUMP,
            [17, 18, 19, 20, 20, 21],
            FRAMERATE,
            false
        );
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
                fire: game.input.keyboard.addKey(Phaser.Keyboard.Q),
                up: game.input.keyboard.addKey(Phaser.Keyboard.W),
                down: game.input.keyboard.addKey(Phaser.Keyboard.S),
                left: game.input.keyboard.addKey(Phaser.Keyboard.A),
                right: game.input.keyboard.addKey(Phaser.Keyboard.D)
            };
        } else if (id === 2) {
            return {
                fire: game.input.keyboard.addKey(Phaser.Keyboard.U),
                up: game.input.keyboard.addKey(Phaser.Keyboard.I),
                down: game.input.keyboard.addKey(Phaser.Keyboard.K),
                left: game.input.keyboard.addKey(Phaser.Keyboard.J),
                right: game.input.keyboard.addKey(Phaser.Keyboard.L)
            };
        } else {
            const input = game.input.keyboard.createCursorKeys();
            input.fire = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
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
        const hl = this.input.left.isDown;
        const hr = this.input.right.isDown;
        const hu = this.input.up.isDown;
        const hd = this.input.down.isDown;
        const hf = this.input.fire.isDown;

        const i = x => (x ? 1 : 0);

        const current = {
            hl: i(hl),
            hr: i(hr),
            hu: i(hu),
            hd: i(hd),
            hf: i(hf)
        };

        const newPresses = {};

        const makeKey = k => `n${k.substring(1)}`;
        Object.keys(this.prevInput || []).forEach(k => {
            newPresses[makeKey(k)] = i(!this.prevInput[k] && current[k]);
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
            vx,
            vy,
            isFlipped,
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

        if (isNumber(vx)) {
            this.sprite.body.velocity.x = vx;
        }

        if (isNumber(vy)) {
            this.sprite.body.velocity.y = vy;
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

        if (isBool(isFlipped)) {
            this.sprite.scale.setTo(isFlipped ? -1 : 1, 1);
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

    update() {
        this.state.wasOnGround = this.state.grounded;
    }

    handleInput() {
        const { hr, hl, hu, hd, nr, nl, nu, nd, hf, nf } = this.getInput();

        const {
            inputInterrupt,
            climbingRope,
            touchingRope,
            crouching,
            rolling
        } = this.state;
        //weapon animation refreshes
        // if (inputInterrupt == 0 && forceAnimUpdate)
        // {
        // 	if (isOnRope()) {
        // 		if (vy > 0)
        // 			playClimbingDown();
        // 		else
        // 			playClimbingUp();
        // 	}
        // 	else if (isOnGround())
        // 		playRunning();
        // 	else if (bUnstable)
        // 		playPushedForward();
        // 	else
        // 		playFalling();

        // 	if (hl || hr)
        // 		setFlipped(hl, getFlippedv());

        // 	forceAnimUpdate = false;
        // }

        // //netted physics
        // if (nettedStrength > 0)
        // {
        // 	handleNetted(nu);
        // 	return;
        // }

        if (this.sprite.body.left <= 0) {
            //bouncing off the left wall
            this.setFlipped(true);
            this.bounce();
        } else if (this.sprite.body.right >= game.world.width) {
            //bouncing off the right wall
            this.setFlipped(false);
            this.bounce();
        } else if (inputInterrupt < now()) {
            //regular controls
            if (climbingRope) {
                // 		if (touchingRope == NULL)
                // 		{
                // 			vy = 0;
                // 			vx = (hr - hl) * WALKSPEED;
                // 			bClimbingRope = false;
                // 			justfell();
                // 		} else {
                // 			vy = (hd - hu) * CLIMBSPEED;
                // 			//don't allow to climb off rope via up/down keys
                // 			if (touchingRope->childRopes[touchingRope->childRopes.size()-1]->getBottom() < getBottom() && vy > 0)
                // 				vy = 0;
                // 			else if (touchingRope->childRopes[0]->getTop() > getTop() && vy < 0)
                // 				vy = 0;
                // 			if (nd)
                // 				playClimbingDown();
                // 			else if (nu)
                // 				playClimbingUp();
                // 			if (vy == 0) setFrame(frame);
                // 			if (hr || hl)	//jump off!
                // 			{
                // 				vx = (hr - hl) * WALKSPEED;
                // 				vy = 0;
                // 				bClimbingRope = false;
                // 				setFlipped(hl);
                // 				justfell();
                // 			}
                // 		}
            } else if (this.isOnGround()) {
                if (!this.wasOnGround()) {
                    //reset collision bounds, etc
                    this.justLanded(hr, hl);
                }
                this.state.unstable = false;
                if (
                    touchingRope != null &&
                    (hu || nu || hd || nd) &&
                    !(hl || hr) &&
                    !crouching &&
                    !rolling
                ) {
                    this.climbRope(hd);
                } else if (rolling) {
                    // 			if (arbitraryAnim == 0)	//anim finished, so stop moving (PROBABLY A BAD IDEA)
                    // 			{
                    // 				bRolling = false;
                    // 				bCrouching = true;
                    // 				//recovered from a roll, so reset collision & warp usage state
                    // 				lastCollision = CS_NONE;
                    // 				bJustUnwarped = false;
                    // 			}
                } else if (crouching) {
                    // 			vx = 0;
                    // 			if (!hd)
                    // 				uncrouch(hr, hl);
                } else {
                    this.applyState({ vx: (hr - hl) * playerConfig.RUN_SPEED });

                    if (nr) {
                        this.setFlipped(false);
                        this.playRunning();
                    } else if (nl) {
                        this.setFlipped(true);
                        this.playRunning();
                    } else if (hd)
                        //crouch
                        this.crouch();
                    else if (!hr && !hl) {
                        //standing still
                        this.playIdle();
                    }
                    if (nu) {
                        this.jump();
                    }
                }
            } else {
                // 		if (wasOnGround() && !justJumped)
                // 			justfell();
                // 		justJumped = false;
                // 		if (usingChut())		//parachut midair controls
                // 		{
                // 			vx = (vx==0 && !hr && !hl ? 0 : (flippedh ? WALKSPEED*-1 : WALKSPEED));
                // 			//vx = (flippedh ? WALKSPEED*-1 : WALKSPEED);
                // 			//vx = (hr - hl) * WALKSPEED;
                // 			if (nr)
                // 				setFlipped(false);
                // 			else if (nl)
                // 				setFlipped(true);
                // 		}
            }
        }

        // //weapon stuffs
        // if (currWeapon != NULL)
        // {
        // 	if (nf && !currWeapon->isFiring())
        // 		currWeapon->fire();
        // 	if (!hf && currWeapon->isFiring())
        // 		currWeapon->stopFiring();
        // }
        debugRender({ y: this.sprite.body.velocity.y });
    }

    isOnGround() {
        return this.state.grounded;
    }

    wasOnGround() {
        return this.state.wasGrounded;
    }

    justLanded(hr, hl) {
        this.setBounds(playerConfig.STANDING_BOUNDS);
        this.setFlipped(hr - hl == 0 ? null : hr - hl < 0, null);
        if (this.state.unstable) {
            // roll((vx > 0 && flippedh) || (vx < 0 && !flippedh));
        } else {
            this.applyState({ vx: 0 });
            this.playRunning();
            this.state.lastCollision = collisions.NONE; // back to normal!
            this.state.justUnwarped = false; //reset the warp usage state.
        }
    }

    jump(bootsJump) {
        if (!this.isOnGround()) {
            return false;
        }
        //setBasePos(getBottom() - 1);	//move off the ground
        this.state.justJumped = true; //stops routine 'just airborne' checks happening
        this.state.crouching = false;
        this.state.rolling = false;

        let vy = -playerConfig.JUMP_IMPULSE;
        if (bootsJump) {
            vy = vy * 3 / 2;
        }
        this.applyState({ vy });

        if (this.sprite.body.velocity.x === 0) {
            this.playJumpedStanding();
        } else {
            this.playJumpedMoving();
        }

        this.setBounds(playerConfig.FALLING_BOUNDS);
        return true;
    }

    setFlipped(fh, fv) {
        // if (bRotating && rotSetID != -1)	//cant be flipped if rotating at the same time
        //     return;

        // flippedh = fh;
        // flippedv = fv;
        // if (oldFliph != flippedh)
        // {
        //     swapHBounds();
        //     oldFliph = flippedh;
        // }
        // if (oldFlipv != flippedv)
        // {
        //     swapVBounds();
        //     oldFlipv = flippedv;
        // }
        // UPDATEDflip = true;
        this.applyState({ isFlipped: fh });
    }

    /////////////////////////////////////////
    /////////////////////////////////////////
    /////////////////////////////////////////
    /////////////////////////////////////////

    playIdle() {
        this.applyState({ animation: animations.STAND });
    }

    playRunning() {
        this.applyState({ animation: animations.RUN });
    }

    playJumpedStanding() {
        this.applyState({ animation: animations.STAND_JUMP });
    }

    playJumpedMoving() {
        this.applyState({ animation: animations.RUN_JUMP });
    }

    /////////////////////////////////////////
    /////////////////////////////////////////
    /////////////////////////////////////////
    /////////////////////////////////////////
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
