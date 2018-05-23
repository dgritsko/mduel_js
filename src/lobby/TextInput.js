import Control from "./Control";

export default class TextInput extends Control {
    constructor(x, y, width, height, params) {
        super(x, y, width, height, params);

        let { fontSize } = params;
        let { maxLength } = params || -1;

        fontSize = fontSize || 12;

        this.label = game.add.bitmapText(
            6,
            height / 2,
            "mduel-menu",
            "",
            fontSize
        );
        this.label.anchor.setTo(0, 0.5);
        this.g.addChild(this.label);

        this.maxLength = maxLength || -1;

        game.input.keyboard.addCallbacks(
            this,
            null,
            function(evt) {
                // var char = String.fromCharCode(evt.keyCode).toString();
                // var pattern = /[A-Za-z0-9 ]/;
                // if (pattern.test(char)) {

                if (
                    evt.key.length == 1 &&
                    (this.maxLength === -1 || this.text.length < this.maxLength)
                ) {
                    this.text += evt.key;
                } else if (evt.keyCode === 8) {
                    evt.preventDefault();
                    this.text =
                        this.text.length > 0
                            ? this.text.slice(0, this.text.length - 1)
                            : "";
                }
            },
            null
        );
    }

    get text() {
        return this.label.text;
    }

    set text(value) {
        this.label.text = value;
    }
}
