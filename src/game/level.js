import cfg from "./config";

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
    let result = [];

    // Left spawn
    for (let j = 0; j < 18; j++) {
        result.push({ row: 4, column: j + 0.5, isSpawn: true });
    }

    for (let j = 1; j < 4; j++) {
        result.push({ row: 2, column: j, isSpawn: false });
        result.push({ row: 3, column: j, isSpawn: false });
    }

    return result;

    const {
        verticalSpacing,
        verticalOffset,
        horizontalSpacing,
        horizontalOffset
    } = cfg;

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
                for (
                    var j = 0;
                    j < game.rnd.integerInRange(0, maxGapWidth);
                    j++
                ) {
                    curr.push(false);
                }
            } else {
                for (
                    let j = 0;
                    j <
                    game.rnd.integerInRange(minPlatformWidth, maxPlatformWidth);
                    j++
                ) {
                    curr.push(true);
                }
                for (
                    let j = 0;
                    j < game.rnd.integerInRange(minGapWidth, maxGapWidth);
                    j++
                ) {
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

        const temp = curr
            .map((value, index) => ({ value, index }))
            .filter(item => item.value)
            .map(item => ({ row: i, column: item.index, isSpawn: false }));

        result = result.concat(temp);
    }

    return result;
}

export { generateRopes, generatePlatforms };
