export default class Label {
    constructor(x, y, text, params) {
        let { fontSize } = params || {};

        fontSize = fontSize || 14;

        this.g = game.add.bitmapText(x, y, "mduel-menu", text, fontSize);

        this.g.anchor.setTo(0.5);
    }
}
