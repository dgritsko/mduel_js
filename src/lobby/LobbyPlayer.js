import { addAnimations } from "../game/Player/animations";

export default class LobbyPlayer {
    constructor(id, skin, input, x, y) {
        this.id = id;
        this.skin = skin;
        this.input = input;

        this.sprite = game.add.sprite(x, y, skin);
        this.sprite.anchor.setTo(0.5);

        addAnimations(this.sprite);
    }
}
