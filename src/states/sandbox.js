import {
    createModifiedSpritesheet,
    buildPixelModificationFunction,
    analyzeSprite,
    grayscale
} from "../game/spriteUtil";

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    const stats = analyzeSprite("player1");

    const primaryColor = stats[0].color;
    const secondaryColor = stats[1].color;
    const tertiaryColor = stats[2].color;
    const quaternaryColor = stats[3].color;
    const quinaryColor = stats[4].color;

    const ruleSets = [
        [{ match: primaryColor, apply: "0000ff" }],
        [{ match: secondaryColor, apply: "0000ff" }],
        [{ match: tertiaryColor, apply: "#0000ff" }],
        [{ match: quaternaryColor, apply: "#0000ff" }],
        [{ match: quinaryColor, apply: "#0000ff" }]
    ];

    ruleSets.forEach((rules, i) => {
        const fun = buildPixelModificationFunction(rules);

        const sprite = "player1_temp_" + i;

        createModifiedSpritesheet("player1", sprite, fun);

        for (let j = 0; j < 6; j++) {
            game.add.sprite((i + 1) * 64, j * 64, sprite, j);
        }
    });
}

export default { create };
