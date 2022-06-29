import { GameConfig } from "../config";
import { IFireballConstructor } from "../interfaces/fireball.interface";

export class Fireball extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;

    // variables
    private currentScene: Phaser.Scene;
    private speed: number = 200;

    constructor(aParams: IFireballConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture);

        // variables
        this.currentScene = aParams.scene;
        this.speed = aParams.flip * this.speed;
        this.initSprite();
        this.currentScene.add.existing(this);
    }

    private initSprite() {
        // sprite
        this.setOrigin(0, 0);
        this.setFrame(0);

        // physics
        this.currentScene.physics.world.enable(this);
        this.body.setSize(8, 8);
        this.body.setAllowGravity(true);
        this.anims.play('fireballFly', true);

        // Create fireball counter
        this.currentScene.time.addEvent({
            callback: () => {
                this.destroy();
            },
            callbackScope: this,
            delay: 4000,
            loop: false
        })
    }


    update(...args: any[]): void {
        this.y += -1.5;
        if (this.y > GameConfig.height) {
            this.destroy()
            return
        }
        this.body.setVelocityX(this.speed);

        // if fireball is moving into obstacle from map layer, turn
        if (this.body.blocked.right || this.body.blocked.left) {
            this.speed = -this.speed;
            this.body.velocity.x = this.speed;
        }

        if (
            !Phaser.Geom.Intersects.RectangleToRectangle(
                this.getBounds(),
                this.currentScene.cameras.main.worldView
            )
        ) {
            this.destroy()
        }
    }

    collideEnemy() {
        this.destroy()
    }


}
