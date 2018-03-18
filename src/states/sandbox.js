function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // let manager = new ItemManager();

    // shadow
    //565656

    // primary
    // AC4AAC
    drawText("MARSHMALLOW DUEL", 100, 100);
}

function render() {
}

function drawText(text, x, y) {
    const offsetX = 2;
    const offsetY = 2;
    const shadowLabel = game.add.bitmapText(
        x + offsetX,
        y + offsetY,
        "mduel",
        text,
        32
    );
    shadowLabel.tint = 0x565656;

    const mainLabel = game.add.bitmapText(x, y, "mduel", text, 32);
    mainLabel.tint = 0xac4aac;
}

function update() {}

export default { create: create, update: update, render: render };
