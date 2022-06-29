import { IPlatformConstructor } from '../interfaces/platform.interface';

export class Platform extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;

    // variables
    private currentScene: Phaser.Scene;
    private tweenProps: any;
    private previousX: number;
    private previousY: number;
    public startY: number;
    public type: string;

    constructor(aParams: IPlatformConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture);

        // variables
        this.currentScene = aParams.scene;
        this.tweenProps = aParams.tweenProps;
        this.previousX = aParams.x;
        this.previousY = aParams.y;
        this.startY = aParams.y;
        if (aParams.frame == 1) {
            this.type = 'up'
        } else {
            this.type = 'left'
        }

        this.initImage();
        this.initTween();
        this.currentScene.add.existing(this);
    }

    private initImage(): void {
        // image
        this.setOrigin(0, 0);
        this.setFrame(0);

        // physics
        this.currentScene.physics.world.enable(this);
        this.body.setSize(48, 16);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
    }

    private initTween(): void {
        this.currentScene.tweens.add({
            targets: this,
            props: this.tweenProps,
            ease: 'Power0',
            yoyo: true,
            repeat: -1,
            onUpdate: () => {
                this.body.velocity.x = this.body.position.x - this.previousX;
                this.body.velocity.y = this.body.position.y - this.previousY;
                this.previousX = this.body.position.x;
                this.previousY = this.body.position.y;
            }
        });

    }

    update(): void { }
}
