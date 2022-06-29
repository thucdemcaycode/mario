import { ICollectibleConstructor } from '../interfaces/collectible.interface';

export class Collectible extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;

    // variables
    private currentScene: Phaser.Scene;
    private points: number;
    private key: string;

    constructor(aParams: ICollectibleConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

        // variables
        this.currentScene = aParams.scene;
        this.points = aParams.points;
        this.key = aParams.texture;
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
        this.body.setAllowGravity(false);
    }

    update(): void { }

    public collected(): void {
        if (this.key == 'coin2') {
            this.currentScene.sound.play('coin');
        }
        this.destroy();
        this.currentScene.registry.values.score += this.points;
        this.currentScene.events.emit('scoreChanged');
    }
}
