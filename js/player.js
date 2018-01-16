MarshmallowDuel.Player = class {
    constructor() {
        this.sprite = game.add.sprite(game.camera.view.centerX, game.camera.view.centerY, 'player1');
        this.sprite.anchor.setTo(0.5);

        this.sprite.animations.add('stand', [0], 0, false);
        this.sprite.animations.add('run', [1,2,3,4], 12, true);
        this.sprite.animations.add('crouch', [6,5], 2, false);
        this.sprite.animations.add('roll', [7,8,9,10], 10, true);
        this.sprite.animations.add('jump', [11,12,13,14,15,16,17], 10, true);
        this.sprite.animations.add('run_jump', [18,19,20], 10, true);
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

        this.sprite.animations.play('stand');

        game.physics.enable(this.sprite);

        this.sprite.body.setSize(this.sprite.width / 2, this.sprite.height - 16, this.sprite.width / 4, 8);

        this.location = MarshmallowDuel.Player.Locations.PLATFORM;
    }
}

MarshmallowDuel.Player.Locations = {
    PLATFORM: 0,
    ROPE: 1,
    AIR: 2,
    PIT: 3
}