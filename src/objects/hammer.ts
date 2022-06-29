import { GameConfig } from "../config";
import { ISpriteConstructor } from "../interfaces/sprite.interface";

export class Hammer extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;

    // variables
    private currentScene: Phaser.Scene;


    constructor(aParams: ISpriteConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

        // variables
        this.currentScene = aParams.scene;
        this.initSprite();
        this.currentScene.add.existing(this);
    }

    private initSprite() {
        // sprite
        this.setOrigin(0, 0);
        this.setFrame(0);

        // physics
        this.currentScene.physics.world.enable(this);
        this.body.setSize(16, 16);
        this.body.setAllowGravity(true);
        this.body.setVelocityX(-200);
        this.body.setVelocityY(-250);
        this.anims.play('hammerFly', true);
    }

    update(...args: any[]): void {
        if (this.y > GameConfig.height) {
            this.destroy()
        }
    }


}
