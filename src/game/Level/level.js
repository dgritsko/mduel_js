import { levelConfig } from "../config";

function generateRopes(platforms) {
    const result = [];

    // Fixed top ropes
    result.push({ column: 3.5, row: 0, length: 5 });
    result.push({ column: 13.5, row: 0, length: 5 });

    const leftRopes = [];
    const otherRopes = [];

    const isPlatform = (column, row) =>
        platforms.filter(p => p.row == row && p.column == column).length > 0;

    for (let i = 1; i < 18; i++) {
        // Make sure the ropes don't spawn directly next to the fixed ropes
        if ([3, 4, 13, 14].indexOf(i) > -1) {
            continue;
        }

        const options = [];
        if (isPlatform(i, 1) && isPlatform(i, 2)) {
            options.push({ column: i, row: 1, length: 2 });
        }
        if (isPlatform(i, 2) && isPlatform(i, 3)) {
            options.push({ column: i, row: 2, length: 2 });
        }
        if (isPlatform(i, 1) && isPlatform(i, 3)) {
            options.push({ column: i, row: 1, length: 3 });
        }

        if (options.length > 0) {
            const item = Phaser.ArrayUtils.getRandomItem(options);

            if (i < 4) {
                leftRopes.push(item);
            } else if (i > 4 && i != 14) {
                otherRopes.push(item);
            }
        }
    }

    if (leftRopes.length > 0) {
        result.push(Phaser.ArrayUtils.getRandomItem(leftRopes));
    }

    if (otherRopes.length > 0) {
        // Hard max of other ropes is 4
        const max = Math.min(
            otherRopes.length,
            Math.floor(Math.random() * 3) + 1
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
    if (levelConfig.TEST_LEVEL) {
        return generateTestPlatforms();
    }

    let result = [];

    const {
        LEVEL_WIDTH,
        LEVEL_HEIGHT,
        MAX_SECTION_WIDTH,
        MIN_SECTION_WIDTH,
        MAX_GAP_WIDTH,
        MIN_GAP_WIDTH } = levelConfig;

    levelConfig.FIXED_PLATFORMS.forEach(p => {
        for (let j = p.column; j < p.column + p.width; j++) {
            result.push({ row: p.row, column: j, isSpawn: p.isSpawn })
        }
    })

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
                    game.rnd.integerInRange(MIN_SECTION_WIDTH, MAX_SECTION_WIDTH);
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

function generateTestPlatforms() {
    const result = [];

    // Left spawn
    for (let j = -1; j < 18; j++) {
        result.push({ row: 4, column: j + 0.5, isSpawn: true });
    }

    for (let j = 1; j < 4; j++) {
        result.push({ row: 2, column: j, isSpawn: false });
        result.push({ row: 3, column: j, isSpawn: false });
    }

    return result;
}

export { generateRopes, generatePlatforms };
