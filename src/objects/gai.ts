import { Enemy } from './enemy';
import { ISpriteConstructor } from '../interfaces/sprite.interface';

export class Gai extends Enemy {
    body: Phaser.Physics.Arcade.Body;

    constructor(aParams: ISpriteConstructor) {
        super(aParams);
        this.speed = -30;
        this.dyingScoreValue = 100;
        this.name = 'gai';
    }

    update(): void {
        if (!this.isDying) {
            if (this.isActivated) {
                // goomba is still alive
                // add speed to velocity x
                this.body.setVelocityX(this.speed);

                // if goomba is moving into obstacle from map layer, turn
                if (this.body.blocked.right || this.body.blocked.left) {
                    this.setFlipX(this.body.velocity.x < 0);
                    this.speed = -this.speed;
                    this.body.velocity.x = this.speed;
                }

                // apply walk animation
                this.anims.play('gaiWalk', true);
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
        this.body.setVelocityX(20);
        this.body.setVelocityY(-20);
        this.setFlipY(true);
        this.showAndAddScore();
    }

}
