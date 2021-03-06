import { gameConfig } from "../config";
import { render } from "./render";
import { spawnOrientations } from "../../enums/spawnOrientations";

function generateRopes(platforms) {
    const {
        LEVEL_HEIGHT,
        LEVEL_WIDTH,
        MIN_RANDOM_ROPES,
        MAX_RANDOM_ROPES,
        FIXED_ROPES
    } = gameConfig;

    const result = [];

    // Fixed top ropes
    const fixedRopeColumns = [];
    FIXED_ROPES.forEach(r => {
        fixedRopeColumns.push(Math.floor(r.column));
        fixedRopeColumns.push(Math.ceil(r.column));
        result.push(Object.assign({}, r));
    });

    const otherRopes = [];

    const isPlatform = (column, row) =>
        platforms.filter(p => p.row == row && p.column == column).length > 0;

    for (let i = 1; i < LEVEL_WIDTH; i++) {
        // Make sure the ropes don't spawn directly next to the fixed ropes
        if (fixedRopeColumns.indexOf(i) > -1) {
            continue;
        }

        const options = [];

        for (let j = 1; j < LEVEL_HEIGHT; j++) {
            for (let k = j + 1; k < LEVEL_HEIGHT; k++) {
                if (isPlatform(i, j) && isPlatform(i, k)) {
                    options.push({ column: i, row: j, length: k - j + 1 });
                }
            }
        }

        if (options.length > 0) {
            const item = Phaser.ArrayUtils.getRandomItem(options);

            otherRopes.push(item);
        }
    }

    if (otherRopes.length > 0) {
        const max = Math.min(
            otherRopes.length,
            Math.random() * (MAX_RANDOM_ROPES - MIN_RANDOM_ROPES) +
                MIN_RANDOM_ROPES
        );

        let count = 0;
        while (count < max && otherRopes.length > 0) {
            result.push(Phaser.ArrayUtils.removeRandomItem(otherRopes));

            count++;
        }
    }

    return result;
}

function expandFixedPlatform(info) {
    const result = [];
    for (let j = info.column; j < info.column + info.width; j++) {
        result.push({ row: info.row, column: j, isSpawn: info.isSpawn });
    }
    return result;
}

function generatePlatforms() {
    let result = [];

    const {
        LEVEL_WIDTH,
        LEVEL_HEIGHT,
        LEVEL_MAX_SECTION_WIDTH,
        LEVEL_MIN_SECTION_WIDTH,
        LEVEL_MAX_GAP_WIDTH,
        LEVEL_MIN_GAP_WIDTH
    } = gameConfig;

    gameConfig.FIXED_PLATFORMS.forEach(p =>
        result.push(...expandFixedPlatform(p))
    );

    // Randomized platforms
    for (let i = 1; i < LEVEL_HEIGHT - 1; i++) {
        let curr = [];
        while (curr.length < LEVEL_WIDTH) {
            // 50% of the time, choose to start the level with a gap
            if (curr.length == 0 && game.rnd.integerInRange(0, 1) == 1) {
                for (
                    var j = 0;
                    j < game.rnd.integerInRange(0, LEVEL_MAX_GAP_WIDTH);
                    j++
                ) {
                    curr.push(false);
                }
            } else {
                for (
                    let j = 0;
                    j <
                    game.rnd.integerInRange(
                        LEVEL_MIN_SECTION_WIDTH,
                        LEVEL_MAX_SECTION_WIDTH
                    );
                    j++
                ) {
                    curr.push(true);
                }
                for (
                    let j = 0;
                    j <
                    game.rnd.integerInRange(
                        LEVEL_MIN_GAP_WIDTH,
                        LEVEL_MAX_GAP_WIDTH
                    );
                    j++
                ) {
                    curr.push(false);
                }
            }
        }
        curr = curr.slice(0, LEVEL_WIDTH);

        // Since we can run past the max level width, slicing off the extra can result in a
        // 1-width platform at the end of the level. In this case, make sure it's at least
        // length 2
        if (curr[LEVEL_WIDTH - 1] && !curr[LEVEL_WIDTH - 2]) {
            curr[LEVEL_WIDTH - 2] = true;
        }

        const temp = curr
            .map((value, index) => ({ value, index }))
            .filter(item => item.value)
            .map(item => ({ row: i, column: item.index, isSpawn: false }));

        result = result.concat(temp);
    }

    return result;
}

function generateItemSpawns() {
    const makeSpawn = (orientation, x, y) => ({ orientation, x, y });

    const top = makeSpawn(spawnOrientations.TOP, game.world.centerX, 0);
    const left = makeSpawn(spawnOrientations.LEFT, 0, game.world.height / 2);
    const right = makeSpawn(
        spawnOrientations.RIGHT,
        game.world.width,
        game.world.height / 2
    );

    return [top, left, right];
}

function generateTestPlatforms() {
    const result = [];

    gameConfig.DEBUG_PLATFORMS.forEach(p =>
        result.push(...expandFixedPlatform(p))
    );

    return result;
}

function createNewLevel() {
    const platformSpec = gameConfig.DEBUG_LEVEL
        ? generateTestPlatforms()
        : generatePlatforms();

    const ropeSpec = generateRopes(platformSpec);

    const spawnSpec = generateItemSpawns();

    const spec = {
        platformSpec,
        ropeSpec,
        spawnSpec
    };

    return render(spec);
}

export { createNewLevel };
