let description = '';

function init(args) {
    description = describe(args);
}

function create() {
    const text = game.add.bitmapText(
        game.world.centerX,
        game.world.centerY,
        "mduel-menu",
        description,
        16
    );

    text.anchor.setTo(0.5);

    text.tint = 0xa439a4;
}

function describe(scores) {
    const keys = Object.keys(scores)

    // TODO: "Percy vs. Clifford"

    const firstScore = scores[keys[0]]
    const secondScore = scores[keys[1]]

    if (firstScore === secondScore) {
        return `Series Tied, ${firstScore} - ${secondScore}`
    }

    return firstScore > secondScore
        ? `${keys[0]} leads series, ${firstScore} - ${secondScore}`
        : `${keys[1]} leads series, ${secondScore} - ${firstScore}`
}

export default { init, create };
