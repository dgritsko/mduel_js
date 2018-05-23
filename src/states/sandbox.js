import { setupVoltsSprite } from "../game/spriteUtil";
import NameInput from "../lobby/NameInput";

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    const nameInput = new NameInput(100, 100);
    // setupVoltsSprite("player1");
    nameInput.value = "Percy";

    // window.setTimeout(() => {
    //     console.log(nameInput.value);
    //     nameInput.destroy();
    // }, 3000);
}

export default { create };
