import { colors } from "../enums/colors";

export default class Control {
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

    addChild(child) {
        this.g.addChild(child);
    }
}
