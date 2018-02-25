import { levelConfig } from "./config";
import { generatePlatforms, generateRopes } from "./level";
import { makePlatform } from "./platform";
import { platform_types } from "../enums/platform_types";

function makeLevel() {
    const {
        verticalSpacing,
        verticalOffset,
        horizontalSpacing,
        horizontalOffset
    } = levelConfig;

    const levelHeight = 5;
    const levelWidth = 18;

    const spawnWidth = 4;

    const platforms = game.add.group();
    const platformInfos = generatePlatforms();

    platformInfos.forEach(info => {
        const x = info.column * horizontalSpacing + horizontalOffset;
        const y = info.row * verticalSpacing + verticalOffset;

        const platform = makePlatform(
            x,
            y,
            info.isSpawn ? platform_types.SPAWN : platform_types.DEFAULT
        );

        platforms.add(platform);
    });

    // Ropes
    const ropes = generateRopes(platformInfos);

    ropes.forEach(r => {
        r.x = r.column * horizontalSpacing + 47;
        r.y = r.row * verticalSpacing + 32;

        const anchor = game.add.sprite(r.x, r.y, "rope", 0);
        anchor.anchor.setTo(0.5, 1);

        const total = r.length * 2;

        const segments = game.add.group();

        for (let si = 0; si < total; si++) {
            const sy = si * 32;

            const segment = game.add.sprite(r.x, r.y + sy, "rope", 1);
            segment.anchor.setTo(0.5, 0);

            if (si === total - 1) {
                segment.scale.setTo(1, 0.5);
            }
            segments.add(segment);
        }

        game.physics.enable(anchor);
        anchor.body.moves = false;
        anchor.body.immovable = true;

        // TODO: Move these hitbox adjustments to constants elsewhere
        anchor.body.setSize(11, 11, 11, 21);

        segments.children.forEach(s => {
            game.physics.enable(s);
            s.body.moves = false;
            s.body.immovable = true;
            // TODO: Move these hitbox adjustments to constants elsewhere
            s.body.setSize(4, 32, 15);
        });

        r.anchor = anchor;
        r.segments = segments;
    });

    // Powerup spawns
    const topSpawn = game.add.sprite(game.world.centerX, 0, "powerup_spawn");
    topSpawn.anchor.setTo(0.5, 0);

    const powerupYOffset = -32;
    const leftSpawn = game.add.sprite(
        0,
        game.world.height / 2 + powerupYOffset,
        "powerup_spawn"
    );
    leftSpawn.anchor.setTo(0.5, 0);
    leftSpawn.angle = -90;

    const rightSpawn = game.add.sprite(
        game.world.width,
        game.world.height / 2 + powerupYOffset,
        "powerup_spawn"
    );
    rightSpawn.anchor.setTo(0.5, 0);
    rightSpawn.scale.setTo(-1, 1);
    rightSpawn.angle = 90;

    // Marshmallows
    const marshmallows = game.add.group();
    for (let j = 0; j < game.world.width / horizontalSpacing; j++) {
        const mallowSurface = game.add.sprite(
            j * horizontalSpacing,
            game.world.height - horizontalSpacing * 1.75,
            "mallow_surface"
        );
        mallowSurface.animations.add(
            "default",
            [j % 4, (j + 1) % 4, (j + 2) % 4, (j + 3) % 4],
            0.25,
            true
        );
        mallowSurface.animations.play("default");
        marshmallows.add(mallowSurface);

        const marshmallow = game.add.sprite(
            j * horizontalSpacing,
            game.world.height - horizontalSpacing,
            "mallow"
        );
        marshmallows.add(marshmallow);
    }

    return {
        platforms,
        topSpawn,
        leftSpawn,
        rightSpawn,
        marshmallows,
        ropes
    };
}

export { makeLevel };
