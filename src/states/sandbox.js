import {
    createModifiedSpritesheet,
    combineSpriteSheets,
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

    const firstQuartile = (p, x, y) => y % 64 < 16;
    const secondQuartile = (p, x, y) => y % 64 >= 16 && y % 64 < 32;
    const thirdQuartile = (p, x, y) => y % 64 >= 32 && y % 64 < 48;
    const fourthQuartile = (p, x, y) => y % 64 >= 48;

    const ruleSets = [
        [{ match: [primaryColor, firstQuartile], apply: "0000ff" }],
        [{ match: secondaryColor, apply: "0000ff" }],
        [{ match: tertiaryColor, apply: "#0000ff" }],
        [{ match: quaternaryColor, apply: "#0000ff" }],
        [{ match: quinaryColor, apply: "#0000ff" }]
    ];

    ruleSets.forEach((rules, i) => {
        const fun = buildPixelModificationFunction(rules);

        const sprite = "player1_temp_" + i;

        createModifiedSpritesheet("player1", sprite, fun);

        for (let j = 0; j < 1; j++) {
            game.add.sprite((i + 1) * 64, j * 64, sprite, -1);
        }
    });

    combineSpriteSheets(
        ruleSets.map((r, i) => `player1_temp_${i}`),
        "combinedSprite",
        true
    );
}

export default { create };
