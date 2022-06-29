import { Enemy } from './enemy';
import { ISpriteConstructor } from '../interfaces/sprite.interface';
import { Gai } from './gai';

export class Cloud extends Enemy {
    body: Phaser.Physics.Arcade.Body;
    event: Phaser.Time.TimerEvent;

    constructor(aParams: ISpriteConstructor) {
        super(aParams);
        this.speed = -50;
        this.dyingScoreValue = 300;
        this.name = 'cloud';
        this.body.setAllowGravity(false);
        this.body.setSize(17, 29)

        this.initChangeDirEvent();
    }
    initChangeDirEvent() {
        // Create fireball counter
        this.event = this.currentScene.time.addEvent({
            callback: () => {
                this.speed = -this.speed;
                this.body.velocity.x = this.speed;

                this.createGai();
            },
            callbackScope: this,
            delay: 2000,
            loop: true
        })
    }

    createGai() {
        this.currentScene.addEnemy(new Gai({
            scene: this.currentScene,
            x: this.x,
            y: this.y,
            texture: 'gai'
        }))
    }

    update(): void {
        if (!this.isDying) {
            if (this.isActivated) {
                // cloud is still alive
                // add speed to velocity x
                this.body.setVelocityX(this.speed);

                // apply walk animation
                this.anims.play('cloudWalk', true);
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
            // cloud is dying, so stop animation, make velocity 0 and do not check collisions anymore
            this.anims.stop();
            this.body.setVelocity(0, 0);
            this.body.checkCollision.none = true;
        }
    }

    public gotHitOnHead(): void {
        this.isDying = true;
        this.setFrame(1);
        this.showAndAddScore();
        this.event.remove();
    }

    public gotHitFromBulletOrMarioFlower(): void {
        this.isDying = true;
        this.body.setVelocityX(20);
        this.body.setVelocityY(-20);
        this.setFlipY(true);
        this.showAndAddScore();
        this.event.remove();
    }

}
