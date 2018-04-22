import { now, isBool, isNumber, setBounds, debugRender } from "../util";
import { animations } from "../../enums/animations";
import { collisions } from "../../enums/collisions";
import { playerConfig } from "../config";
import { addAnimations } from "./animations";
import { SpriteObject } from "../spriteObject";
import { items } from "../../enums/items";
import { deaths } from "../../enums/deaths";

export class Player extends SpriteObject {
    constructor(spriteName, x, y, id, teamId) {
        super();

        this.id = id;
        this.teamId = teamId;

        this.sprite = game.add.sprite(x, y, spriteName);
        this.configureSprite();

        this.state = {
            alive: true,
            inputEnabled: false,
            lastCollision: collisions.NONE,
            crouching: false,
            rolling: false,
            unstable: false,
            justJumped: false,
            lastLandedTime: 0,
            x: x,
            y: y,
            flipped: false,
            touchingRope: null,
            wasTouchingRope: null,
            climbingRope: false,
            currItem: null,
            lastItemChangeTime: 0,
            itemJustCleared: false,
            nettedStrength: 0,
            justUnwarped: false,
            inputInterrupt: 0,
            recentCollisionIds: []
        };

        this.input = this.configureInput(id);
    }

    set animation(value) {
        if (value === animations.NONE) {
            this.sprite.animations.stop();
        } else if (
            this.sprite.animations.currentAnim.name !== value ||
            this.sprite.animations.currentAnim.loop
        ) {
            this.sprite.animations.play(value);
        }
    }

    get flippedh() {
        return this.sprite.scale.x === -1;
    }

    set flippedh(value) {
        if (isNumber(value) || isBool(value)) {
            this.sprite.scale.setTo(value ? -1 : 1, this.sprite.scale.y);
        }
    }

    get allowGravity() {
        return this.sprite.body.allowGravity;
    }

    set allowGravity(value) {
        this.sprite.body.allowGravity = value;
    }

    get recentCollisionIds() {
        return this.state.recentCollisionIds;
    }

    configureSprite() {
        this.sprite.anchor.setTo(0.5, 0.5);

        this.sprite.scale.setTo(this.sprite.x < game.world.centerX ? 1 : -1, 1);

        addAnimations(this.sprite);

        game.physics.enable(this.sprite);

        setBounds(this.sprite, playerConfig.STANDING_BOUNDS);

        this.sprite.body.maxVelocity = new Phaser.Point(
            playerConfig.RUN_SPEED,
            playerConfig.TERMINAL_VELOCITY
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
        const inputEnabled = this.state.inputEnabled;

        const hl = this.input.left.isDown && inputEnabled;
        const hr = this.input.right.isDown && inputEnabled;
        const hu = this.input.up.isDown && inputEnabled;
        const hd = this.input.down.isDown && inputEnabled;
        const hf = this.input.fire.isDown && inputEnabled;

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
        const position = { x: this.x, y: this.y };
        const velocity = {
            vx: this.vx,
            vy: this.vy
        };

        const flippedh = this.flippedh;

        return Object.assign({}, this.state, position, velocity, { flippedh });
    }

    update(itemManager, gameManager) {
        this.state.wasGrounded = this.state.grounded;
        this.state.wasTouchingRope = this.state.touchingRope;

        if (this.hasItem()) {
            this.state.currItem.update(this, itemManager);
        }

        if (this.y >= game.world.height) {
            gameManager.killPlayer(this, deaths.PIT);
        }
    }

    requestAnimationUpdate() {
        this.animationUpdateRequested = true;
    }

    updateAnimation(hl, hr) {
        // item animation refreshes
        if (this.state.climbingRope) {
            if (this.vy > 0) this.playClimbingDown();
            else {
                this.playClimbingUp();
            }
        } else if (this.state.grounded) {
            this.playRunning();
        } else if (this.state.unstable) {
            this.playPushedForward();
        } else {
            this.playFalling();
        }

        if (hl || hr) {
            this.flippedh = hl;
        }
    }

    handleInput(itemManager, gameManager) {
        const { hr, hl, hu, hd, nr, nl, nu, nd, hf, nf } = this.getInput();

        if (this.animationUpdateRequested) {
            this.updateAnimation(hl, hr);
            this.animationUpdateRequested = false;
        }

        // //netted physics
        // if (nettedStrength > 0)
        // {
        // 	handleNetted(nu);
        // 	return;
        // }

        const canHandleInput =
            this.state.inputInterrupt !== -1 &&
            this.state.inputInterrupt < now();

        if (this.left <= 0) {
            // bouncing off the left wall
            this.flippedh = true;
            this.bounce();
        } else if (this.right >= game.world.width) {
            // bouncing off the right wall
            this.flippedh = false;
            this.bounce();
        } else if (canHandleInput) {
            // regular controls
            if (this.state.climbingRope) {
                if (this.state.touchingRope === null) {
                    this.vy = 0;
                    this.vx = (hr - hl) * playerConfig.RUN_SPEED;

                    this.state.climbingRope = false;
                    this.justfell();
                } else {
                    this.vy = (hd - hu) * playerConfig.CLIMB_SPEED;
                    // don't allow to climb off rope via up/down keys
                    const touchingRope = this.state.touchingRope;
                    const topSegment = touchingRope.segments.children[0];
                    const bottomSegment =
                        touchingRope.segments.children[
                            touchingRope.segments.children.length - 1
                        ];

                    if (
                        bottomSegment.body.bottom < this.bottom &&
                        this.vy > 0
                    ) {
                        // TODO: maybe allow falling off the bottom segment if the platform immediately below it is gone?
                        this.vy = 0;
                    } else if (topSegment.body.top > this.top && this.vy < 0) {
                        this.vy = 0;
                    }

                    if (!hd && !hu) {
                        this.animation = animations.NONE;
                    }

                    if (nd) {
                        this.playClimbingDown();
                    } else if (nu) {
                        this.playClimbingUp();
                    }
                    // 			if (vy == 0) setFrame(frame);
                    if (hr || hl) {
                        //jump off!
                        this.vx = (hr - hl) * playerConfig.RUN_SPEED;
                        this.vy = 0;

                        this.state.climbingRope = false;
                        this.flippedh = hl;
                        this.justfell();
                    }
                }
            } else if (this.state.grounded) {
                if (!this.state.wasGrounded) {
                    // reset collision bounds, etc
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
                    // anim finished, so stop moving (PROBABLY A BAD IDEA)
                    if (this.sprite.animations.currentAnim.isFinished) {
                        this.state.rolling = false;
                        this.state.crouching = true;
                        // recovered from a roll, so reset collision & warp usage state
                        this.state.lastCollision = collisions.NONE;
                        this.state.justUnwarped = false;

                        this.animation = animations.CROUCHED;
                    }
                } else if (this.state.crouching) {
                    this.vx = 0;
                    if (!hd) {
                        this.uncrouch(hr, hl);
                    }
                } else {
                    if (!hr || !hl) {
                        this.vx = (hr - hl) * playerConfig.RUN_SPEED;

                        if (hd) {
                            this.crouch();
                        } else if (nr || (hr && !hl)) {
                            this.flippedh = false;
                            this.playRunning();
                        } else if (nl || (hl && !hr)) {
                            this.flippedh = true;
                            this.playRunning();
                        } else if (!hr && !hl) {
                            // standing still
                            this.playIdle();
                        }
                    }

                    if (nu) {
                        this.jump();
                    } else if (this.state.wasGrounded && this.vy === 0 && hu) {
                        // Make sure you can't "float" after landing on a platform while holding up
                        this.flippedh = hr - hl == 0 ? null : hr - hl < 0;
                        this.jump();
                    }
                }
            } else {
                if (this.state.wasGrounded && !this.state.justJumped) {
                    this.justfell();
                }
                this.state.justJumped = false;

                // parachut midair controls
                if (this.hasItem({ type: items.CHUTE, isFiring: true })) {
                    this.vx =
                        this.vx === 0 && !hr && !hl
                            ? 0
                            : this.flippedh
                                ? playerConfig.RUN_SPEED * -1
                                : playerConfig.RUN_SPEED;
                    if (nr) {
                        this.flippedh = false;
                    } else if (nl) {
                        this.flippedh = true;
                    }
                }
            }
        }

        // item stuffs
        if (this.hasItem()) {
            if (canHandleInput && nf && !this.state.currItem.firing) {
                this.state.currItem.fire(this, itemManager, gameManager);
            }

            if (!hf && this.state.currItem.firing) {
                this.state.currItem.stopFiring(this);
            }
        }
    }

    justLanded(hr, hl) {
        const { unstable, vx, flippedh } = this.getState();

        this.state.lastLandedTime = now();

        setBounds(this.sprite, playerConfig.STANDING_BOUNDS);

        if (unstable) {
            this.roll((vx > 0 && flippedh) || (vx < 0 && !flippedh));
        } else {
            // NOTE: Moved this within the "else" block as otherwise it would let
            // the player horizontally flip as they rolled after being unstable
            this.flippedh = hr - hl == 0 ? null : hr - hl < 0;
            this.vx = 0;

            this.playRunning();
            // back to normal!
            this.state.lastCollision = collisions.NONE;
            //reset the warp usage state.
            this.state.justUnwarped = false;
        }
    }

    jump(bootsJump) {
        if (!this.state.grounded) {
            return false;
        }

        if (
            (this.state.lastLandedTime || 0) +
                playerConfig.MINIMUM_JUMP_INTERVAL >
            now()
        ) {
            return false;
        }

        //stops routine 'just airborne' checks happening
        this.state.justJumped = true;
        this.state.crouching = false;
        this.state.rolling = false;

        let vy = -playerConfig.JUMP_IMPULSE;
        if (bootsJump) {
            vy = vy * 3 / 2;
        }

        this.vy = vy;

        if (this.vx === 0) {
            this.playJumpedStanding();
        } else {
            this.playJumpedMoving();
        }

        setBounds(this.sprite, playerConfig.FALLING_BOUNDS);
        return true;
    }

    bounce(pushedForwards) {
        if (this.hasItem({ isFiring: true })) {
            this.state.currItem.stopFiring(this);
        }

        this.state.justJumped = true;
        this.state.unstable = true;
        this.state.crouching = false;
        this.state.rolling = false;
        this.state.climbingRope = false;
        setBounds(this.sprite, playerConfig.FALLING_BOUNDS);

        let vx = null;
        let vy = null;

        if (pushedForwards) {
            vx = this.flippedh
                ? -playerConfig.RUN_SPEED
                : playerConfig.RUN_SPEED;
            this.playPushedForward();
        } else {
            vx = this.flippedh
                ? playerConfig.RUN_SPEED
                : -playerConfig.RUN_SPEED;
            this.playPushedBackward();
        }

        if (this.state.grounded) {
            vy = playerConfig.JUMP_IMPULSE * 2 / 3;
        }

        this.vx = vx;
        this.vy = vy;
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
        setBounds(this.sprite, playerConfig.CROUCHING_BOUNDS);
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
        setBounds(this.sprite, playerConfig.CROUCHING_BOUNDS);
        return true;
    }

    uncrouch(hr, hl) {
        this.state.crouching = false;

        // TODO: wtf is this
        //ignoreUntilUntouched = NULL; //stop the whole tripping thing

        setBounds(this.sprite, playerConfig.STANDING_BOUNDS);

        this.flippedh = hr - hl == 0 ? null : hr - hl < 0;
        this.playRunning();
    }

    justfell() {
        this.allowGravity = true;

        this.state.rolling = false;
        this.state.crouching = false;
        //if (vx == 0)
        //	vx = (flippedh ? -WALKSPEED : WALKSPEED);
        setBounds(this.sprite, playerConfig.FALLING_BOUNDS);
        if (!this.state.unstable) {
            this.playFalling();
        } else {
            (this.vx < 0 && this.flippedh) || (this.vx > 0 && !this.flippedh)
                ? this.playPushedForward()
                : this.playPushedBackward();
        }
    }

    climbRope(hd) {
        if (this.state.touchingRope !== null) {
            this.x = this.state.touchingRope.x;
        } else if (this.state.wasTouchingRope !== null) {
            // this is mainly for the hook's way of doing it
            this.x = this.state.wasTouchingRope.x;
        } else {
            return;
        }
        this.allowGravity = false;
        this.state.climbingRope = true;
        hd ? this.playClimbingDown() : this.playClimbingUp();
    }

    hasItem(args) {
        const { type, isFiring } = args || {};

        const currItem = this.state.currItem;

        if (!currItem) {
            return false;
        }

        const typeCheck = typeof type !== "number" || currItem.type === type;

        const firingCheck =
            typeof isFiring !== "boolean" || currItem.firing === isFiring;

        return typeCheck && firingCheck;
    }

    // Collisions
    collideWithPlayer(otherPlayer, gameManager) {
        // Stop current item stuff

        if (this.hasItem({ isFiring: true })) {
            this.state.currItem.stopFiring(this);
        }

        if (otherPlayer.hasItem({ isFiring: true })) {
            otherPlayer.state.currItem.stopFiring(this);
        }

        // //shield handling
        // if (o->hasShield() && hasShield())
        // {
        // 	if (isFacing(o) && !o->isFacing(this))
        // 	{
        // 		o->collideNormally(this);
        // 		o->lastCollision = CS_SHIELDPLAYER;
        // 	}
        // 	else if (o->isFacing(this) && !isFacing(o))
        // 	{
        // 		collideNormally(o);
        // 		lastCollision = CS_SHIELDPLAYER;
        // 	}
        // 	else {
        // 		o->collideNormally(this);
        // 		collideNormally(o);
        // 		o->lastCollision = CS_SHIELDPLAYER;
        // 		lastCollision = CS_SHIELDPLAYER;
        // 	}
        // 	return;
        // }
        // else if (o->hasShield() && !hasShield() && o->isFacing(this))
        // {
        // 	collideNormally(o);
        // 	lastCollision = CS_SHIELDPLAYER;
        // 	return;
        // }
        // else if (hasShield() && !o->hasShield() && isFacing(o))
        // {
        // o->collideNormally(this);
        // o->lastCollision = CS_SHIELDPLAYER;
        // return;
        // }
        // //lightning handling
        if (
            otherPlayer.hasItem({ type: items.VOLTS }) &&
            !this.hasItem({ type: items.VOLTS })
        ) {
            // we die
            gameManager.killPlayer(this, deaths.VOLTS);
            return;
        } else if (
            this.hasItem({ type: items.VOLTS }) &&
            !otherPlayer.hasItem({ type: items.VOLTS })
        ) {
            // they die
            gameManager.killPlayer(otherPlayer, deaths.VOLTS);
            return;
        } else if (
            this.hasItem({ type: items.VOLTS }) &&
            otherPlayer.hasItem({ type: items.VOLTS })
        ) {
            //nobody dies, weapons destroyed
            this.clearItem();
            otherPlayer.clearItem();
        }

        if (
            !this.state.crouching ||
            (this.state.crouching &&
                (otherPlayer.state.rolling || !otherPlayer.state.wasGrounded))
        ) {
            if (
                (otherPlayer.state.crouching || otherPlayer.state.rolling) &&
                this.state.wasGrounded &&
                !this.state.crouching &&
                !this.state.rolling
            ) {
                // if other player gets under your feet
                const dontMove = this.vx === 0 && otherPlayer.state.rolling;
                this.bounce(true);
                if (dontMove) {
                    this.vx = 0;
                }

                this.vy = -playerConfig.JUMP_IMPULSE * 2 / 3;
                // if (o->usingInvis())
                // 	lastCollision = CS_INVISPLAYER;
                // else if (o->bJustUnwarped)
                // 	lastCollision = CS_WARPEDPLAYER;
                // else
                // 	lastCollision = CS_BASICHIT;
            } else if (
                this.state.rolling &&
                otherPlayer.state.wasGrounded &&
                !otherPlayer.state.crouching &&
                !otherPlayer.state.rolling
            ) {
                // if you get under other player's feet
                const dontMove = otherPlayer.vx == 0;
                otherPlayer.bounce(true);

                if (dontMove) {
                    otherPlayer.vx = 0;
                }
                // 		ignoreUntilUntouched = other;
                otherPlayer.vy = -playerConfig.JUMP_IMPULSE * 2 / 3;
                // if (usingInvis())
                // 	o->lastCollision = CS_INVISPLAYER;
                // else if (bJustUnwarped)
                // 	o->lastCollision = CS_WARPEDPLAYER;
                // else
                // 	o->lastCollision = CS_BASICHIT;
            } else {
                // otherwise we must be talking a normal bump!
                otherPlayer.collideNormally(this);
                this.collideNormally(otherPlayer);
                // if (o->usingInvis())
                // 	lastCollision = CS_INVISPLAYER;
                // else if (o->bJustUnwarped)
                // 	lastCollision = CS_WARPEDPLAYER;
                // else
                this.state.lastCollision = collisions.BASICHIT;
                // 	lastCollision = CS_BASICHIT;

                // if (usingInvis())
                // 	o->lastCollision = CS_INVISPLAYER;
                // else if (bJustUnwarped)
                // 	o->lastCollision = CS_WARPEDPLAYER;
                // else
                // 	o->lastCollision = CS_BASICHIT;
                otherPlayer.state.lastCollision = collisions.BASICHIT;
            }
        }
    }

    collideNormally(otherPlayer) {
        this.state.climbingRope = false;
        this.allowGravity = true;

        if (this.x === otherPlayer.x) {
            this.y < otherPlayer.y
                ? this.bounce(this.flippedh)
                : this.bounce(!this.flippedh);
        } else {
            this.x < otherPlayer.x
                ? this.bounce(this.flippedh)
                : this.bounce(!this.flippedh);
        }
        this.vy = -playerConfig.JUMP_IMPULSE * 2 / 3;
    }

    // Items
    setItem(item) {
        this.clearItem();
        this.state.currItem = item;
    }

    clearItem() {
        if (this.hasItem()) {
            this.state.currItem.destroy(this);
            this.state.currItem = null;
        }
    }

    // Animations

    playIdle() {
        if (
            this.sprite.animations.currentAnim.loop ||
            this.sprite.animations.currentAnim.isFinished
        ) {
            this.animation = animations.STAND;
        }
    }

    playRunning() {
        this.animation = animations.RUN;
    }

    playJumpedStanding() {
        this.animation = animations.STAND_JUMP;
    }

    playJumpedMoving() {
        this.animation = animations.RUN_JUMP;
    }

    playPushedBackward() {
        this.animation = animations.BACKWARD_FALL;
    }

    playPushedForward() {
        this.animation = animations.FORWARD_FALL;
    }

    playRolling() {
        this.animation = animations.FORWARD_ROLL;
    }

    playRollingBack() {
        this.animation = animations.BACKWARD_ROLL;
    }

    playFalling() {
        this.animation = animations.STAND_FALL;
    }

    playCrouching() {
        this.animation = animations.CROUCHING;
    }

    playClimbingDown() {
        this.animation = animations.CLIMB_DOWN;
    }

    playClimbingUp() {
        this.animation = animations.CLIMB_UP;
    }

    playSkulled() {
        this.animation = animations.SKULLED;
    }

    playDisintegrated() {
        this.animation = animations.DISINTEGRATED;
    }

    playVictoryDance() {
        this.animation = animations.VICTORY_DANCE;
    }

    playRopeVictory() {
        this.animation = animations.ROPE_VICTORY;
    }

    playVictoryFlex() {
        this.animation = animations.VICTORY_FLEX;
    }
}
