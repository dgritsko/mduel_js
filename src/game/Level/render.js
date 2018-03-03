import { levelConfig } from "../config";
import { makePlatform } from "./platform";
import { platformTypes } from "../../enums/platformTypes";
import { spawnOrientations } from "../../enums/spawnOrientations";
import { setBounds } from "../util";

function render(spec) {
    const { platformSpec, ropeSpec, spawnSpec } = spec;

    const platforms = renderPlatforms(platformSpec);

    const ropes = renderRopes(ropeSpec);

    const itemSpawns = renderItemSpawns(spawnSpec);

    const marshmallows = renderMarshmallows();

    return {
        platforms,
        marshmallows,
        ropes,
        itemSpawns
    };
}

function renderPlatforms(platformInfos) {
    const { COLUMN_WIDTH, COLUMN_OFFSET, ROW_HEIGHT, ROW_OFFSET } = levelConfig;

    const platforms = game.add.group();
    platformInfos.forEach(info => {
        const x = info.column * COLUMN_WIDTH + COLUMN_OFFSET;
        const y = info.row * ROW_HEIGHT + ROW_OFFSET;

        const platform = makePlatform(
            x,
            y,
            info.isSpawn ? platformTypes.SPAWN : platformTypes.DEFAULT
        );

        platforms.add(platform);
    });

    return platforms;
}

function renderRopes(ropeInfos) {
    const {
        COLUMN_WIDTH,
        ROW_HEIGHT,
        ROPE_ANCHOR_BOUNDS,
        ROPE_SEGMENT_BOUNDS
    } = levelConfig;

    const ropes = [];

    ropeInfos.forEach(ropeInfo => {
        const r = Object.assign({}, ropeInfo);

        r.x =
            r.column * COLUMN_WIDTH +
            Math.floor(COLUMN_WIDTH * 1.5) -
            (ROPE_SEGMENT_BOUNDS.right - ROPE_SEGMENT_BOUNDS.left) / 2;
        r.y = r.row * ROW_HEIGHT + ROW_HEIGHT / 2;

        const anchor = game.add.sprite(r.x, r.y, "rope", 0);
        anchor.anchor.setTo(0.5, 1);

        const total = r.length * 2;

        const segments = game.add.group();

        for (let si = 0; si < total; si++) {
            const sy = si * (ROW_HEIGHT / 2);

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

        setBounds(anchor, ROPE_ANCHOR_BOUNDS);

        segments.children.forEach(s => {
            game.physics.enable(s);
            s.body.moves = false;
            s.body.immovable = true;
            setBounds(s, ROPE_SEGMENT_BOUNDS);
        });

        r.anchor = anchor;
        r.segments = segments;

        ropes.push(r);
    });

    return ropes;
}

function renderItemSpawns(spawnInfos) {
    return spawnInfos.map(s => {
        const sprite = game.add.sprite(s.x, s.y, "powerup_spawn");

        const spawnPoint = { x: 0, y: 0 };

        switch (s.orientation) {
            case spawnOrientations.TOP:
                sprite.anchor.setTo(0.5, 0);

                spawnPoint.x = sprite.centerX;
                spawnPoint.y = sprite.bottom;
                break;
            case spawnOrientations.LEFT:
                sprite.anchor.setTo(0.5, 0);
                sprite.angle = -90;

                spawnPoint.x = sprite.height;
                spawnPoint.y = sprite.y;
                break;
            case spawnOrientations.RIGHT:
                sprite.anchor.setTo(0.5, 0);
                sprite.scale.setTo(-1, 1);
                sprite.angle = 90;

                spawnPoint.x = game.world.width - sprite.height;
                spawnPoint.y = sprite.y;
                break;
        }

        return { sprite, spawnPoint, orientation: s.orientation };
    });
}

function renderMarshmallows() {
    const { COLUMN_WIDTH, MARSHMALLOW_FRAMERATE } = levelConfig;

    const marshmallows = game.add.group();
    for (let j = 0; j < game.world.width / COLUMN_WIDTH; j++) {
        const mallowSurface = game.add.sprite(
            j * COLUMN_WIDTH,
            game.world.height - COLUMN_WIDTH * 1.75,
            "mallow_surface"
        );
        mallowSurface.animations.add(
            "default",
            [j % 4, (j + 1) % 4, (j + 2) % 4, (j + 3) % 4],
            MARSHMALLOW_FRAMERATE,
            true
        );
        mallowSurface.animations.play("default");
        marshmallows.add(mallowSurface);

        const marshmallow = game.add.sprite(
            j * COLUMN_WIDTH,
            game.world.height - COLUMN_WIDTH,
            "mallow"
        );
        marshmallows.add(marshmallow);
    }

    return marshmallows;
}

export { render };
