export default class LobbyItem {
    constructor(type, x, y) {
        this.type = type;
        this.sprite = game.add.sprite(x, y, "items");
        // sprite.animations.add("default", [0, 1, 2], 4, true);
        // sprite.animations.play("default");
        this.sprite.anchor.setTo(0.5);

        this.disabledSprite = game.add.sprite(0, 0, "items_grayscale");
        this.disabledSprite.anchor.setTo(0.5);
        this.sprite.addChild(this.disabledSprite);

        this.icon = game.add.sprite(0, 0, "items");
        this.icon.frame = type + 3;
        this.icon.anchor.setTo(0.5);
        this.sprite.addChild(this.icon);

        this.disabledIcon = game.add.sprite(0, 0, "items_grayscale");
        this.disabledIcon.frame = type + 3;
        this.disabledIcon.anchor.setTo(0.5);
        this.disabledSprite.addChild(this.disabledIcon);

        this.enabled = true;

        const label = game.add.bitmapText(
            x,
            y + 24,
            "mduel-menu",
            this.describeItem(type),
            16
        );

        label.anchor.setTo(0.5);
    }

    describeItem(type) {
        switch (type) {
            case 0:
                return "Skull";
            case 1:
                return "Volts";
            case 2:
                return "Cloak";
            case 3:
                return "Mine";
            case 4:
                return "Gun";
            case 5:
                return "TNT";
            case 6:
                return "Boots";
            case 7:
                return "Grenade";
            case 8:
                return "Puck";
            case 9:
                return "Chute";
            case 10:
                return "Hook";
            case 11:
                return "Warp";
            default:
                return type + "";
        }
    }

    get enabled() {
        return this.icon.visible;
    }

    set enabled(value) {
        this.icon.visible = value;
        this.disabledSprite.visible = !value;
    }
}
