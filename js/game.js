(function() {
    let level;
    let player1;

    function preload() {
        // TODO: Load assets
    }

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 800;

        level = makeLevel();
        
        player1 = new MarshmallowDuel.Player();

        player1.input = game.input.keyboard.createCursorKeys();
    }

    function update() {
        game.physics.arcade.collide(player1.sprite, level.platforms, (player, platform) => {

        }, (player, platform) => {
            return (player.y + player.offsetY) >= platform.y;
        });

        if (player1.input.left.isDown) {
            player1.sprite.body.velocity.x = -100;
            player1.sprite.scale.setTo(-1, 1);
            player1.sprite.animations.play('run');
        } else if (player1.input.right.isDown) {
            player1.sprite.body.velocity.x = 100;
            player1.sprite.scale.setTo(1, 1);
            player1.sprite.animations.play('run');
        } else {
            player1.sprite.body.velocity.x = 0;
            player1.sprite.animations.play('stand');
            player1.sprite.animations.stop();
        }

        game.debug.body(player1.sprite);
    }

    function makeLevel() {
        const verticalSpacing = 64;
        const verticalOffset = 80;

        const horizontalSpacing = 32;
        const horizontalOffset = 32;

        const levelHeight = 5;
        const levelWidth = 18;

        const spawnWidth = 4;

        const platforms = game.add.group();
        const platformInfos = generatePlatforms();

        platformInfos.forEach(info => {
            const x = info.column * horizontalSpacing + horizontalOffset;
            const y = info.row * verticalSpacing + verticalOffset;
            const spriteName = info.isSpawn ? 'spawn_platform' : 'main_platform';
            const platform = game.add.sprite(x, y, spriteName);
            platforms.add(platform);
        });

        platforms.children.forEach(p => {
            game.physics.enable(p);
            p.body.moves = false;
            p.body.immovable = true;
        });

        // Ropes
        // TODO
        const ropes = generateRopes();

        ropes.forEach(r => {
            const anchor = game.add.sprite((r.x * horizontalSpacing) + 47, (r.y * verticalSpacing) + 32, 'rope_anchor');
            anchor.anchor.setTo(0.5);
        });

        // Powerup spawns
        const topSpawn = game.add.sprite(game.world.centerX, 0, 'powerup_spawn');
        topSpawn.anchor.setTo(0.5, 0);

        const powerupYOffset = -32;
        const leftSpawn = game.add.sprite(0, game.world.height / 2 + powerupYOffset, 'powerup_spawn');
        leftSpawn.anchor.setTo(0.5, 0);
        leftSpawn.angle = -90;

        const rightSpawn = game.add.sprite(game.world.width, game.world.height / 2 + powerupYOffset, 'powerup_spawn');
        rightSpawn.anchor.setTo(0.5, 0);
        rightSpawn.scale.setTo(-1, 1);
        rightSpawn.angle = 90;

        // Marshmallows
        const marshmallows = game.add.group();
        for (let j = 0; j < (game.world.width / horizontalSpacing); j++) {
            const marshmallow = game.add.sprite(j * horizontalSpacing, game.world.height - horizontalSpacing, 'mallow');
            marshmallows.add(marshmallow);
        }

        return {
            platforms,
            topSpawn,
            leftSpawn,
            rightSpawn,
            marshmallows
        }
    }

    const generatePlatforms = () => {
        let result = [];

        const verticalSpacing = 64;
        const verticalOffset = 80;

        const horizontalSpacing = 32;
        const horizontalOffset = 32;

        const levelHeight = 5;
        const levelWidth = 18;

        const spawnWidth = 4;

        // Left spawn
        for (let j = 0; j < spawnWidth; j++) {
            result.push({ row: 4, column: j + 0.5, isSpawn: true });
        }

        // Right spawn
        for (let j = levelWidth - spawnWidth + 1; j < levelWidth + 1; j++) {
            result.push({ row: 4, column: j - 1.5, isSpawn: true });
        }

        // Top left
        for (let j = 2; j < 6; j++) {
            result.push({ row: 0, column: j, isSpawn: false });
        }
        
        // Top right
        for (let j = 12; j < 16; j++) {
            result.push({ row: 0, column: j, isSpawn: false });
        }

        // Randomized platforms
        for (let i = 1; i < 4; i++) {
            const maxPlatformWidth = 7;
            const minPlatformWidth = 2;
            const maxGapWidth = 2;
            const minGapWidth = 1;

            let curr = [];
            while (curr.length < levelWidth) {
                // 50% of the time, choose to start the level with a gap
                if (curr.length == 0 && game.rnd.integerInRange(0, 1) == 1) {
                    for (var j = 0; j < game.rnd.integerInRange(0, maxGapWidth); j++) {
                        curr.push(false);
                    }
                } else {
                    for (let j = 0; j < game.rnd.integerInRange(minPlatformWidth, maxPlatformWidth); j++) {
                        curr.push(true);
                    }
                    for (let j = 0; j < game.rnd.integerInRange(minGapWidth, maxGapWidth); j++) {
                        curr.push(false);
                    }
                }
            }
            curr = curr.slice(0, levelWidth);
            
            // Since we can run past the max level width, slicing off the extra can result in a 
            // 1-width platform at the end of the level. In this case, make sure it's at least 
            // length 2
            if (curr[levelWidth - 1] && !curr[levelWidth - 2]) {
                curr[levelWidth - 2] = true;
            }

            const temp = curr.map((value, index) => ({ value, index }))
                .filter(item => item.value)
                .map(item => ({ row: i, column: item.index, isSpawn: false }));
            
            result = result.concat(temp);
        }

        return result;
    }

    const generateRopes = () => {
        const result = [];

        // Fixed top ropes
        result.push({ x: 3.5, y: 0, length: 5 });
        result.push({ x: 13.5, y: 0, length: 5 });

        // TODO: Other ropes

        return result;
    }

    MarshmallowDuel.Game = {preload: preload, create: create, update: update};
})();