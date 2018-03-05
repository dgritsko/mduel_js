export class SpriteObject {
    constructor() {}

    get x() {
        return this.sprite.x;
    }

    set x(value) {
        this.sprite.x = value;
    }

    get y() {
        return this.sprite.y;
    }

    set y(value) {
        this.sprite.y = value;
    }

    get vx() {
        return this.sprite.body.velocity.x;
    }

    set vx(value) {
        this.sprite.body.velocity.x = value;
    }

    get vy() {
        return this.sprite.body.velocity.y;
    }

    set vy(value) {
        this.sprite.body.velocity.y = value;
    }

    get animation() {
        return this.sprite.animations.currentAnim.name;
    }
}
