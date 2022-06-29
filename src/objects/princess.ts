import { ISpriteConstructor } from '../interfaces/sprite.interface';
import { GameScene } from '../scenes/GameScene';

export class Princess extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;

    private currentScene: GameScene;

    private isActivated: boolean;
    public isTouched: boolean;


    constructor(aParams: ISpriteConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

        // variables
        this.currentScene = aParams.scene;
        this.initSprite();
        this.currentScene.add.existing(this);

    }

    protected initSprite() {
        // variables
        this.isActivated = false;
        this.isTouched = false;

        // sprite
        this.setOrigin(0, 0);
        this.setFrame(0);

        // physics
        this.currentScene.physics.world.enable(this);
        this.body.setSize(16, 32);
        this.body.setImmovable(true);
    }

    update(): void {
        if (this.isActivated) {
            if (!this.isTouched) {
                this.anims.play('princessWalk', true);
            } else {
                this.anims.play('princessRoll', true);
            }

        } else {
            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    this.getBounds(),
                    this.currentScene.cameras.main.worldView
                )
            ) {
                this.isActivated = true;
            }
        }
    }


}
