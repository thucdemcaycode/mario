import { Enemy } from './enemy';
import { ISpriteConstructor } from '../interfaces/sprite.interface';
import { Hammer } from './hammer';

export class Boss extends Enemy {
    body: Phaser.Physics.Arcade.Body;
    hammers: Phaser.GameObjects.Group;
    health: number;
    THROWING_TIME: number = 2000;
    event: Phaser.Time.TimerEvent;

    constructor(aParams: ISpriteConstructor) {
        super(aParams);
        this.speed = -35;
        this.dyingScoreValue = 5000;
        this.health = 1000;
        this.name = 'boss';
        this.body.setSize(32, 36)
        this.initHammers();
    }
    initHammers() {
        this.hammers = this.currentScene.add.group({
            /*classType: Portal,*/
            runChildUpdate: true
        });

        // Create hammer counter
        this.event = this.currentScene.time.addEvent({
            callback: this.throwHammer,
            callbackScope: this,
            delay: this.THROWING_TIME,
            loop: true
        })
    }
    getHammers() {
        return this.hammers;
    }

    update(): void {
        if (!this.isDying) {
            if (this.isActivated) {
                // boss is still alive
                // add speed to velocity x
                this.body.setVelocityX(this.speed);

                // if boss is moving into obstacle from map layer, turn
                if (this.body.blocked.right || this.body.blocked.left) {
                    this.setFlipX(this.body.velocity.x < 0);
                    this.speed = -this.speed;
                    this.body.velocity.x = this.speed;

                }

                // apply walk animation
                this.anims.play('bossWalk', true);
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
            // boss is dying, so stop animation, make velocity 0 and do not check collisions anymore
            this.anims.stop();
            this.body.setVelocity(0, 0);
            this.body.checkCollision.none = true;
        }
    }

    public gotHitOnHead(): void {
        if (this.health < 0) {
            this.isDying = true;
            this.setFrame(7);
            this.showAndAddScore();
            this.event.remove();
        } else {
            this.health -= 100
        }
    }

    public gotHitFromBulletOrMarioFlower(): void {
        if (this.health < 0) {
            this.isDying = true;
            this.body.setVelocityX(20);
            this.body.setVelocityY(-20);
            this.setFlipY(true);
            this.showAndAddScore();
            this.event.remove();
        } else {
            this.health -= 25;
        }

    }

    throwHammer() {
        if (this.health > 0) {
            const hammer = new Hammer({ scene: this.currentScene, x: this.x, y: this.y, texture: 'hammer' });
            this.hammers.add(hammer);
        }

    }
}