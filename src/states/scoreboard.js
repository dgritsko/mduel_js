function create() {
    const text = game.add.bitmapText(
        game.world.centerX,
        game.world.centerY,
        "mduel-menu",
        "Percy vs. Clifford",
        16
    );

    text.anchor.setTo(0.5);

    text.tint = 0xa439a4;
}

function update() {}

export default { create: create, update: update };
