import { addAnimations } from "../game/Player/animations";

export default class LobbyPlayer {
    constructor(id, skin, input, x, y) {
        this.id = id;
        this.skin = skin;
        this.input = input;

        this.sprite = game.add.sprite(x, y, skin);
        this.sprite.anchor.setTo(0.5);

        this.nameLabel = game.add.bitmapText(
            0,
            this.sprite.height / 2 + 4,
            "mduel-menu",
            "",
            12
        );

        this.nameLabel.anchor.setTo(0.5);

        this.sprite.addChild(this.nameLabel);

        addAnimations(this.sprite);
    }

    get name() {
        return this.nameLabel.text;
    }

    set name(v) {
        this.nameLabel.text = v;
    }
}
