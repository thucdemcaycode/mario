import { ISpriteConstructor } from '../interfaces/sprite.interface';
import { Fireball } from './fireball';
import { Platform } from './platform';

export class Mario extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;

    // variables
    private currentScene: Phaser.Scene;
    private marioSize: string;
    private acceleration: number;
    private isJumping: boolean;
    private isDying: boolean;

    public isOnPlatform: boolean;
    public currentPlatform: Platform;

    private isFireable: boolean;
    private countFireball: number;
    private maxNoFireball: number;
    private isFlip: number;

    private isVulnerable: boolean;
    private vulnerableCounter: number;
    fireballs: Phaser.GameObjects.Group;

    // input
    private keys: Map<string, Phaser.Input.Keyboard.Key>;

    public getKeys(): Map<string, Phaser.Input.Keyboard.Key> {
        return this.keys;
    }

    public getVulnerable(): boolean {
        return this.isVulnerable;
    }

    constructor(aParams: ISpriteConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

        this.currentScene = aParams.scene;
        this.initSprite();
        this.currentScene.add.existing(this);
    }

    private initSprite() {
        // variables
        this.marioSize = this.currentScene.registry.get('marioSize');
        this.acceleration = 1000;
        this.isJumping = false;
        this.isDying = false;
        this.isOnPlatform = false;

        this.isFireable = false;
        this.countFireball = 0;
        this.maxNoFireball = 3;
        this.isFlip = 1;


        this.isVulnerable = true;
        this.vulnerableCounter = 100;
        this.fireballs = this.currentScene.add.group({
            runChildUpdate: true
        })

        // sprite
        this.setOrigin(0.5, 0.5);
        this.setFlipX(false);

        // input
        this.keys = new Map([
            ['LEFT', this.addKey('LEFT')],
            ['RIGHT', this.addKey('RIGHT')],
            ['DOWN', this.addKey('DOWN')],
            ['JUMP', this.addKey('SPACE')]
        ]);
        this.handleThrowFireballInput();

        // Create fireball counter
        this.currentScene.time.addEvent({
            callback: () => {
                this.countFireball = 0;
            },
            callbackScope: this,
            delay: 1500,
            loop: true
        })

        // physics
        this.currentScene.physics.world.enable(this);
        this.adjustPhysicBodyToSmallSize();
        this.body.maxVelocity.x = 100;
        this.body.maxVelocity.y = 420;

        // Continue after passing a level
        if (this.marioSize != 'small') {
            if (this.marioSize === 'flower') {
                this.isFireable = true;
            }
            this.body.setSize(18, 32);
            this.body.setOffset(0, 0);
        } else {
            this.body.setSize(16, 16);
            this.body.setOffset(0, 7);
        }

    }

    private addKey(key: string): Phaser.Input.Keyboard.Key {
        return this.currentScene.input.keyboard.addKey(key);
    }


    update(): void {
        if (!this.isDying) {
            this.handleInput();
            this.handleAnimations();
            this.handelStandingOnPlatform();

        } else {
            this.setFrame(12);
            if (this.y > this.currentScene.sys.canvas.height) {
                this.currentScene.scene.stop('GameScene');
                this.currentScene.scene.stop('HUDScene');
                this.currentScene.scene.start('OverScene');
            }
        }

        if (!this.isVulnerable) {
            if (this.vulnerableCounter > 0) {
                this.vulnerableCounter -= 1;
            } else {
                this.vulnerableCounter = 100;
                this.isVulnerable = true;
            }
        }
    }

    private handleInput() {
        if (this.y > this.currentScene.sys.canvas.height / 2.4) {
            // mario fell into a hole
            this.isDying = true;
            // Play mario_die sound
            this.currentScene.sound.play('mario_die');
        }

        // evaluate if player is on the floor or on object
        // if neither of that, set the player to be jumping
        if (
            this.body.onFloor() ||
            this.body.touching.down ||
            this.body.blocked.down
        ) {
            this.isJumping = false;
            //this.body.setVelocityY(0);
        }

        // handle movements to left and right
        if (this.keys.get('RIGHT').isDown) {
            this.body.setAccelerationX(this.acceleration);
            this.setFlipX(false);
            this.isFlip = 1;
        } else if (this.keys.get('LEFT').isDown) {
            this.body.setAccelerationX(-this.acceleration);
            this.setFlipX(true);
            this.isFlip = -1;
        } else {
            this.body.setVelocityX(0);
            this.body.setAccelerationX(0);
        }

        // handle jumping
        if (this.keys.get('JUMP').isDown && !this.isJumping) {
            this.body.setVelocityY(-280);
            this.isJumping = true;

            // Play jump sound
            this.currentScene.sound.play('jump');
        }

    }

    private handleThrowFireballInput() {
        this.currentScene.input.keyboard.on('keyup-X', this.throwFireball, this)
    }

    public handelStandingOnPlatform() {
        if (this.isOnPlatform && this.currentPlatform) {
            this.body.position.x += this.currentPlatform.body.velocity.x;
            this.body.position.y += this.currentPlatform.body.velocity.y;

            if (this.y >= this.currentPlatform.startY - this.currentPlatform.height / 2 && this.currentPlatform.type == 'up') {
                this.y -= 6
            }
            this.isOnPlatform = false;
            this.currentPlatform = null;
        }
    }

    private handleAnimations(): void {
        if (this.body.velocity.y !== 0 && !this.isOnPlatform) {
            // mario is jumping or falling
            this.anims.stop();
            if (this.marioSize === 'small') {
                this.setFrame(4);
            } else if (this.marioSize === 'flower') {
                this.setFrame(18);
            } else {
                this.setFrame(10);
            }
        } else if (this.body.velocity.x !== 0) {
            // mario is moving horizontal

            // check if mario is making a quick direction change
            if (
                (this.body.velocity.x < 0 && this.body.acceleration.x > 0) ||
                (this.body.velocity.x > 0 && this.body.acceleration.x < 0)
            ) {
                if (this.marioSize === 'small') {
                    this.setFrame(5);
                } else if (this.marioSize === 'flower') {
                    this.setFrame(19);
                } else {
                    this.setFrame(11);
                }
            }

            if (this.body.velocity.x > 0) {
                this.anims.play(this.marioSize + 'MarioWalk', true);
            } else {
                this.anims.play(this.marioSize + 'MarioWalk', true);
            }
        } else {
            // mario is standing still
            this.anims.stop();
            if (this.marioSize === 'small') {
                this.setFrame(0);
            } else {
                if (this.keys.get('DOWN').isDown) {
                    if (this.marioSize === 'flower') {
                        this.setFrame(20);
                    } else {
                        this.setFrame(13);
                    }

                } else {
                    if (this.marioSize === 'flower') {
                        this.setFrame(14);
                    } else {
                        this.setFrame(6);
                    }
                }


            }
        }
    }

    public marioHasFlower(): void {
        this.isFireable = true;
        this.marioSize = 'flower';
        this.currentScene.registry.set('marioSize', 'flower');
        this.adjustPhysicBodyToFlowerSize();
    }

    public growMario(): void {
        if (!this.isFireable) {
            this.marioSize = 'big';
            this.currentScene.registry.set('marioSize', 'big');
            this.adjustPhysicBodyToBigSize();
        }
    }

    private shrinkMario(): void {
        this.marioSize = 'small';
        this.currentScene.registry.set('marioSize', 'small');
        this.adjustPhysicBodyToSmallSize();
    }

    private adjustPhysicBodyToSmallSize(): void {
        this.body.setSize(16, 16);
        this.body.setOffset(0, 7);
    }

    private adjustPhysicBodyToBigSize(): void {
        this.body.setSize(18, 32);
        this.body.setOffset(0, 0);
    }
    private adjustPhysicBodyToFlowerSize(): void {
        this.body.setSize(18, 32);
        this.body.setOffset(0, 0);
    }

    private throwFireball() {
        if (!this.isDying && this.countFireball < this.maxNoFireball && this.isFireable) {
            const fb = new Fireball({ scene: this.currentScene, x: this.x, y: this.y, texture: 'fireball', flip: this.isFlip })
            this.currentScene.sound.play('throw_fireball');
            this.fireballs.add(fb)
            this.countFireball += 1;
        }
    }

    public bounceUpAfterHitEnemyOnHead(): void {
        this.currentScene.add.tween({
            targets: this,
            props: { y: this.y - 5 },
            duration: 200,
            ease: 'Power1',
            yoyo: true
        });
    }

    public gotHit(): void {
        this.isVulnerable = false;
        if (this.marioSize === 'big' || this.marioSize === 'flower') {
            this.isFireable = false;
            this.shrinkMario();
        } else {
            // mario is dying
            this.isDying = true;
            // Play mario_die sound
            this.currentScene.sound.play('mario_die');


            // sets acceleration, velocity and speed to zero
            // stop all animations
            this.body.stop();
            this.anims.stop();

            // make last dead jump and turn off collision check
            this.body.setVelocityY(-180);

            // this.body.checkCollision.none did not work for me
            this.body.checkCollision.up = false;
            this.body.checkCollision.down = false;
            this.body.checkCollision.left = false;
            this.body.checkCollision.right = false;
        }
    }
}
