import { now, isBool, isNumber, isString, debugRender } from "../util";
import { animations } from "../../enums/animations";
import { collisions } from "../../enums/collisions";
import { playerConfig } from "../config";

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
    }

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

        this.sprite.animations.add(animations.CROUCHED, [5], 0, false);

        this.sprite.animations.add(
            animations.UNCROUCH,
            [5, 6],
            FRAMERATE,
            false
        );
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
        this.sprite.animations.add(
            animations.FORWARD_FALL,
            [26, 27],
            FRAMERATE / 2,
            true
        );
        this.sprite.animations.add(
            animations.BACKWARD_FALL,
            [28, 29],
            FRAMERATE / 2,
            true
        );

        this.sprite.animations.add(
            animations.FORWARD_ROLL,
            [7, 8, 9, 10],
            FRAMERATE,
            false
        );
        this.sprite.animations.add(
            animations.BACKWARD_ROLL,
            [6, 22, 23, 24, 25],
            FRAMERATE,
            false
        );
        this.sprite.animations.add(animations.STAND_FALL, [21], 0, true);

        this.sprite.animations.add(
            animations.CLIMB_UP,
            [39, 40, 41, 42],
            FRAMERATE,
            true
        );

        this.sprite.animations.add(
            animations.CLIMB_DOWN,
            [41, 40, 39, 42],
            FRAMERATE,
            true
        );

        // void playPushedForward() {setAnim(26, 27, ANIMSPEED/2);}
        // ///play an animation for falling when unstable and leaning backwards
        // void playPushedBackward() {setAnim(28, 29, ANIMSPEED/2);}

        // this.sprite.animations.add(
        //     animations.CROUCH,
        //     [10, 5],
        //     FRAMERATE,
        //     false
        // );
        // this.sprite.animations.add(animations.CROUCHED, [5], 0, false);
        // this.sprite.animations.add(
        //     animations.TRANSITION,
        //     [6],
        //     FRAMERATE,
        //     false
        // );

        // //this.sprite.animations.add(animations.JUMP, [11,12,13,14,15,16,17], 10, true);
        // this.sprite.animations.add(animations.STAND_FALL, [21], 0, true);
        // this.sprite.animations.add(
        //     animations.FALL_ROLL,
        //     [22, 23, 24, 25],
        //     4,
        //     false
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
        const velocity = {
            vx: this.sprite.body.velocity.x,
            vy: this.sprite.body.velocity.y
        };

        const flippedh = this.sprite.scale.x < 0;

        return Object.assign({}, this.state, position, velocity, { flippedh });
    }

    updateState(existing, update) {
        this.apply(update);
        return Object.assign({}, existing, update);
    }

    apply(newState) {
        const {
            x,
            y,
            dx,
            dy,
            inputEnabled,
            vx,
            vy,
            flippedh,
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

        if (isBool(flippedh)) {
            this.sprite.scale.setTo(flippedh ? -1 : 1, 1);
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
        this.state.wasGrounded = this.state.grounded;
        this.state.wasTouchingRope = this.state.touchingRope;
    }

    handleInput() {
        const { hr, hl, hu, hd, nr, nl, nu, nd, hf, nf } = this.getInput();

        //debugRender(this.getState());
        //weapon animation refreshes
        // if (inputInterrupt == 0 && forceAnimUpdate)
        // {
        // 	if (isOnRope()) {
        // 		if (vy > 0)
        // 			playClimbingDown();
        // 		else
        // 			playClimbingUp();
        // 	}
        // 	else if (this.state.grounded)
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
            this.apply({ flippedh: true });
            this.bounce();
        } else if (this.sprite.body.right >= game.world.width) {
            //bouncing off the right wall
            this.apply({ flippedh: false });
            this.bounce();
        } else if (this.state.inputInterrupt < now()) {
            //regular controls
            if (this.state.climbingRope) {
                if (this.state.touchingRope === null) {
                    this.apply({
                        vy: 0,
                        vx: (hr - hl) * playerConfig.RUN_SPEED
                    });
                    this.state.climbingRope = false;
                    this.justfell();
                } else {
                    this.apply({ vy: (hd - hu) * playerConfig.CLIMB_SPEED });
                    //don't allow to climb off rope via up/down keys
                    const touchingRope = this.state.touchingRope;
                    const topSegment = touchingRope.segments.children[0];
                    const bottomSegment =
                        touchingRope.segments.children[
                            touchingRope.segments.children.length - 1
                        ];

                    if (
                        bottomSegment.body.bottom < this.sprite.body.bottom &&
                        this.sprite.body.velocity.y > 0
                    ) {
                        // TODO: maybe allow falling off the bottom segment if the platform immediately below it is gone?
                        this.apply({ vy: 0 });
                    } else if (
                        topSegment.body.top > this.sprite.body.top &&
                        this.sprite.body.velocity.y < 0
                    ) {
                        this.apply({ vy: 0 });
                    }

                    if (!hd && !hu) {
                        this.apply({ animation: animations.NONE });
                    }

                    if (nd) {
                        this.playClimbingDown();
                    } else if (nu) {
                        this.playClimbingUp();
                    }
                    // 			if (vy == 0) setFrame(frame);
                    if (hr || hl) {
                        //jump off!
                        this.apply({
                            vx: (hr - hl) * playerConfig.RUN_SPEED,
                            vy: 0
                        });

                        this.state.climbingRope = false;
                        this.apply({ flippedh: hl });
                        this.justfell();
                    }
                }
            } else if (this.state.grounded) {
                if (!this.state.wasGrounded) {
                    //reset collision bounds, etc
                    this.justLanded(hr, hl);
                }
                this.state.unstable = false;
                if (
                    this.state.touchingRope !== null &&
                    (hu || nu || hd || nd) &&
                    !(hl || hr) &&
                    !this.state.crouching &&
                    !this.state.rolling
                ) {
                    this.climbRope(hd);
                } else if (this.state.rolling) {
                    //anim finished, so stop moving (PROBABLY A BAD IDEA)
                    if (this.sprite.animations.currentAnim.isFinished) {
                        this.state.rolling = false;
                        this.state.crouching = true;
                        //recovered from a roll, so reset collision & warp usage state
                        this.state.lastCollision = collisions.NONE;
                        this.state.justUnwarped = false;

                        this.apply({ animation: animations.CROUCHED });
                    }
                } else if (this.state.crouching) {
                    this.apply({ vx: 0 });
                    if (!hd) {
                        this.uncrouch(hr, hl);
                    }
                } else {
                    this.apply({ vx: (hr - hl) * playerConfig.RUN_SPEED });

                    if (nr) {
                        this.apply({ flippedh: false });
                        this.playRunning();
                    } else if (nl) {
                        this.apply({ flippedh: true });
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
                if (this.state.wasGrounded && !this.state.justJumped) {
                    this.justfell();
                }
                this.state.justJumped = false;

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
    }

    justLanded(hr, hl) {
        const { unstable, vx, flippedh } = this.getState();

        this.setBounds(playerConfig.STANDING_BOUNDS);

        if (unstable) {
            this.roll((vx > 0 && flippedh) || (vx < 0 && !flippedh));
        } else {
            // NOTE: Moved this within the "else" block as otherwise it would let
            // the player horizontally flip as they rolled after being unstable
            this.apply({ flippedh: hr - hl == 0 ? null : hr - hl < 0, vx: 0 });

            this.playRunning();
            this.state.lastCollision = collisions.NONE; // back to normal!
            this.state.justUnwarped = false; //reset the warp usage state.
        }
    }

    jump(bootsJump) {
        if (!this.state.grounded) {
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
        this.apply({ vy });

        if (this.sprite.body.velocity.x === 0) {
            this.playJumpedStanding();
        } else {
            this.playJumpedMoving();
        }

        this.setBounds(playerConfig.FALLING_BOUNDS);
        return true;
    }

    bounce(pushedForwards) {
        if (this.state.currWeapon != null && this.state.currWeapon.isFiring()) {
            this.state.currWeapon.stopFiring();
        }

        this.state.justJumped = true;
        this.state.unstable = true;
        this.state.crouching = false;
        this.state.rolling = false;
        this.state.climbingRope = false;
        this.setBounds(playerConfig.FALLING_BOUNDS);

        let vx = null;
        let vy = null;

        if (pushedForwards) {
            vx =
                this.sprite.scale.x < 0
                    ? -playerConfig.RUN_SPEED
                    : playerConfig.RUN_SPEED;
            this.playPushedForward();
        } else {
            vx =
                this.sprite.scale.x < 0
                    ? playerConfig.RUN_SPEED
                    : -playerConfig.RUN_SPEED;
            this.playPushedBackward();
        }
        //setBasePos(getBottom() - 1);
        if (this.state.grounded) {
            vy = playerConfig.JUMP_IMPULSE * 2 / 3;
        }

        this.apply({ vx, vy });
    }

    roll(backwards) {
        if (!this.state.grounded) {
            return false;
        }
        if (!backwards) {
            this.playRolling();
        } else {
            this.playRollingBack();
        }
        this.state.rolling = true;
        this.state.crouching = false;
        this.state.unstable = false;
        this.setBounds(playerConfig.CROUCHING_BOUNDS);
        return true;
    }

    crouch() {
        const { vx, unstable } = this.getState();
        if (!this.state.grounded) {
            return false;
        }
        this.state.crouching = true;

        if (vx == 0 && !unstable) {
            this.playCrouching();
        } else {
            this.roll();
        }
        this.setBounds(playerConfig.CROUCHING_BOUNDS);
        return true;
    }

    uncrouch(hr, hl) {
        this.state.crouching = false;

        // TODO: wtf is this
        //ignoreUntilUntouched = NULL; //stop the whole tripping thing

        this.setBounds(playerConfig.STANDING_BOUNDS);

        this.apply({ flippedh: hr - hl == 0 ? null : hr - hl < 0 });
        this.playRunning();
    }

    justfell() {
        const { unstable, vx, flippedh } = this.getState();

        this.sprite.body.allowGravity = true;

        this.state.rolling = false;
        this.state.crouching = false;
        //if (vx == 0)
        //	vx = (flippedh ? -WALKSPEED : WALKSPEED);
        this.setBounds(playerConfig.FALLING_BOUNDS);
        if (!unstable) {
            this.playFalling();
        } else {
            (vx < 0 && flippedh) || (vx > 0 && !flippedh)
                ? this.playPushedForward()
                : this.playPushedBackward();
        }
    }

    climbRope(hd) {
        if (this.state.touchingRope !== null) {
            this.apply({ x: this.state.touchingRope.x });
        } else if (this.state.wasTouchingRope !== null) {
            //this is mainly for the hook's way of doing it
            this.apply({ x: this.state.wasTouchingRope.x });
        } else {
            return;
        }
        this.sprite.body.allowGravity = false;
        this.state.climbingRope = true;
        hd ? this.playClimbingDown() : this.playClimbingUp();
    }

    // Animations

    playIdle() {
        this.apply({ animation: animations.STAND });
    }

    playRunning() {
        this.apply({ animation: animations.RUN });
    }

    playJumpedStanding() {
        this.apply({ animation: animations.STAND_JUMP });
    }

    playJumpedMoving() {
        this.apply({ animation: animations.RUN_JUMP });
    }

    playPushedBackward() {
        this.apply({ animation: animations.BACKWARD_FALL });
    }

    playPushedForward() {
        this.apply({ animation: animations.FORWARD_FALL });
    }

    playRolling() {
        this.apply({ animation: animations.FORWARD_ROLL });
    }

    playRollingBack() {
        this.apply({ animation: animations.BACKWARD_ROLL });
    }

    playFalling() {
        this.apply({ animation: animations.STAND_FALL });
    }

    playCrouching() {
        this.apply({ animation: animations.CROUCHING });
    }

    playClimbingDown() {
        this.apply({ animation: animations.CLIMB_DOWN });
    }

    playClimbingUp() {
        this.apply({ animation: animations.CLIMB_UP });
    }
}
