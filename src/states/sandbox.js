import { setupVoltsSprite } from "../game/spriteUtil";
import { colors } from "../enums/colors";

class Control {
    constructor(x, y, width, height, params) {
        let { borderColor, backgroundColor, cornerRadius, borderWidth } =
            params || {};

        cornerRadius = typeof cornerRadius === "number" ? cornerRadius : 4;
        borderWidth = typeof borderWidth === "number" ? borderWidth : 2;

        borderColor = borderColor || colors.DARK_PURPLE;
        backgroundColor = backgroundColor || colors.BLACK;

        this.g = game.add.graphics(x, y);

        if (cornerRadius === 0) {
            this.g.beginFill(borderColor);
            this.g.drawRect(0, 0, width, height);
            this.g.endFill();

            this.g.beginFill(backgroundColor);
            this.g.drawRect(
                borderWidth,
                borderWidth,
                width - borderWidth * 2,
                height - borderWidth * 2
            );

            this.g.endFill();
        } else {
            this.g.beginFill(borderColor);
            this.g.drawRoundedRect(0, 0, width, height, cornerRadius);
            this.g.endFill();

            this.g.beginFill(backgroundColor);
            this.g.drawRoundedRect(
                borderWidth,
                borderWidth,
                width - borderWidth * 2,
                height - borderWidth * 2,
                cornerRadius
            );
            this.g.endFill();
        }
    }
}

class TextInput extends Control {
    constructor(x, y, width, height, params) {
        super(x, y, width, height, params);

        let { fontSize } = params;
        let { maxLength } = params || -1;

        fontSize = fontSize || 12;

        this.label = game.add.bitmapText(0, 0, "mduel-menu", "", fontSize);
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

class Popup extends Control {
    constructor(x, y, width, height, params) {
        super(x, y, width, height, params);
    }
}

class Label {
    constructor(x, y, text, params) {
        let { fontSize } = params || {};

        fontSize = fontSize || 14;

        this.label = game.add.bitmapText(x, y, "mduel-menu", text, fontSize);
    }
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    const p1 = new Popup(100, 100, 200, 100);

    const t1 = new TextInput(300, 100, 50, 20, {
        cornerRadius: 0,
        borderColor: 0xff0000
    });

    const l1 = new Label(100, 300, "Label");
    // setupVoltsSprite("player1");
}

export default { create };
