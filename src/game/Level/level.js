import { levelConfig } from "../config";
import { render } from "./render";
import { spawnOrientations } from "../../enums/spawnOrientations";

function generateRopes(platforms) {
    const {
        LEVEL_HEIGHT,
        LEVEL_WIDTH,
        MIN_RANDOM_ROPES,
        MAX_RANDOM_ROPES,
        FIXED_ROPES
    } = levelConfig;

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

function generatePlatforms() {
    let result = [];

    const {
        LEVEL_WIDTH,
        LEVEL_HEIGHT,
        MAX_SECTION_WIDTH,
        MIN_SECTION_WIDTH,
        MAX_GAP_WIDTH,
        MIN_GAP_WIDTH
    } = levelConfig;

    levelConfig.FIXED_PLATFORMS.forEach(p => {
        for (let j = p.column; j < p.column + p.width; j++) {
            result.push({ row: p.row, column: j, isSpawn: p.isSpawn });
        }
    });

    // Randomized platforms
    for (let i = 1; i < LEVEL_HEIGHT - 1; i++) {
        let curr = [];
        while (curr.length < LEVEL_WIDTH) {
            // 50% of the time, choose to start the level with a gap
            if (curr.length == 0 && game.rnd.integerInRange(0, 1) == 1) {
                for (
                    var j = 0;
                    j < game.rnd.integerInRange(0, MAX_GAP_WIDTH);
                    j++
                ) {
                    curr.push(false);
                }
            } else {
                for (
                    let j = 0;
                    j <
                    game.rnd.integerInRange(
                        MIN_SECTION_WIDTH,
                        MAX_SECTION_WIDTH
                    );
                    j++
                ) {
                    curr.push(true);
                }
                for (
                    let j = 0;
                    j < game.rnd.integerInRange(MIN_GAP_WIDTH, MAX_GAP_WIDTH);
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

    for (let j = -1; j < 18; j++) {
        result.push({ row: 4, column: j + 0.5, isSpawn: true });
    }

    for (let j = 1; j < 4; j++) {
        result.push({ row: 2, column: j, isSpawn: false });
        result.push({ row: 3, column: j, isSpawn: false });
    }

    return result;
}

function createNewLevel() {
    const platformSpec = levelConfig.TEST_LEVEL
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
