import { Enemy } from './enemy';
import { ISpriteConstructor } from '../interfaces/sprite.interface';

export class FlowerMonster extends Enemy {
    body: Phaser.Physics.Arcade.Body;

    constructor(aParams: ISpriteConstructor) {
        super(aParams);
        this.speed = -20;
        this.dyingScoreValue = 200;
        this.name = 'flower_monster'
        this.setSize(16, 24);
        this.body.setAllowGravity(false)
        this.body.setImmovable(true)
    }

    update(): void {
        if (!this.isDying) {
            if (this.isActivated) {
                this.anims.play('flower_monster', true);
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
        } else {
            // goomba is dying, so stop animation, make velocity 0 and do not check collisions anymore
            this.anims.stop();
            this.body.setVelocity(0, 0);
            this.body.checkCollision.none = true;
        }
    }

    public gotHitOnHead(): void {

    }

    public gotHitFromBulletOrMarioFlower(): void {
        this.isDying = true;
        this.showAndAddScore();
    }

}
