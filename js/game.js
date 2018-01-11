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

        platformInfos.forEach(p => {
            const spriteName = p.isSpawn ? 'spawn_platform' : 'main_platform';
            const platform = game.add.sprite(p.x, p.y, spriteName);
            platforms.add(platform);
        });

        // for (let i = 0; i < (levelHeight - 1); i++) {
        //     for (let j = 0; j < levelWidth; j++) {
        //         const platform = game.add.sprite((j * horizontalSpacing) + horizontalOffset, (i * verticalSpacing) + verticalOffset, 'main_platform');
        //         platforms.add(platform);
        //     }
        // }

        // // Left spawn
        // for (let j = 0; j < spawnWidth; j++) {
        //     const platform = game.add.sprite((j * horizontalSpacing) + horizontalOffset * 1.5, (4 * verticalSpacing) + verticalOffset, 'spawn_platform');
        //     platforms.add(platform);
        // }

        // // Right spawn
        // for (let j = levelWidth - spawnWidth + 1; j < levelWidth + 1; j++) {
        //     const platform = game.add.sprite((j * horizontalSpacing) - horizontalOffset * 0.5, (4 * verticalSpacing) + verticalOffset, 'spawn_platform');
        //     platforms.add(platform);
        // }

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
        const result = [];

        const verticalSpacing = 64;
        const verticalOffset = 80;

        const horizontalSpacing = 32;
        const horizontalOffset = 32;

        const levelHeight = 5;
        const levelWidth = 18;

        const spawnWidth = 4;

        // Left spawn
        for (let j = 0; j < spawnWidth; j++) {
            result.push({ x: (j * horizontalSpacing) + horizontalOffset * 1.5, y: (4 * verticalSpacing) + verticalOffset, isSpawn: true });
        }

        // Right spawn
        for (let j = levelWidth - spawnWidth + 1; j < levelWidth + 1; j++) {
            result.push({ x: (j * horizontalSpacing) - horizontalOffset * 0.5, y: (4 * verticalSpacing) + verticalOffset, isSpawn: true });
        }

        // Top left
        for (let j = 2; j < 6; j++) {
            result.push({ x: (j * horizontalSpacing) + horizontalOffset, y: verticalOffset, isSpawn: false });
        }
        
        // Top right
        for (let j = 12; j < 16; j++) {
            result.push({ x: (j * horizontalSpacing) + horizontalOffset, y: verticalOffset, isSpawn: false });
        }

        // Randomized platforms
        for (let i = 1; i < 4; i++) {
            const maxPlatformWidth = 7;
            const minPlatformWidth = 2;
            const maxGapWidth = 2;
            const minGapWidth = 1;

            let isPlatform = Math.floor(Math.random() * 2);
            const parts = [];

            const currentWidth = () => (_.reduce(_.pluck(parts, 'width'), (a, b) => (a + b), 0));

            while (currentWidth() < levelWidth) {
                const minWidth = isPlatform ? minPlatformWidth : minGapWidth;
                const maxWidth = isPlatform ? maxPlatformWidth : maxGapWidth;
    
                const newWidth = Math.floor(Math.random() * (maxWidth + 1 - minWidth)) + minWidth;
    
                parts.push({ width: newWidth, isPlatform: isPlatform });

                isPlatform = !isPlatform;

                // const currentLevelWidth = currentWidth();
                // if (currentLevelWidth > levelWidth) {
                //     const oldWidth = parts[parts.length - 1].width;

                //     parts[parts.length - 1].width -= (currentLevelWidth - levelWidth);
                //     parts[parts.length - 1].isPlatform = false;

                //     const newWidth = parts[parts.length - 1].width;
                // }
            }

            let counter = 0;
            for (let j = 0; j < parts.length; j++) {
                
                for (let k = 0; k < parts[j].width; k++) {
                    const x = j + k + counter;

                    if (parts[j].isPlatform && x < levelWidth) {
                        result.push({ x: (x * horizontalSpacing) + horizontalOffset, y: (i * verticalSpacing) + verticalOffset, isSpawn: false });
                    }
                }

                counter += parts[j].width;
            }
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