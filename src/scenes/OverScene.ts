export class OverScene extends Phaser.Scene {
    private retryKey: Phaser.Input.Keyboard.Key;
    private exitKey: Phaser.Input.Keyboard.Key;
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];

    constructor() {
        super({
            key: 'OverScene'
        });
    }

    init(): void {
        this.retryKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.R
        );
        this.exitKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.E
        );
        this.retryKey.isDown = false;
        this.exitKey.isDown = false;
    }

    create(): void {
        this.add.image(0, 0, 'title').setOrigin(0, 0);

        this.bitmapTexts.push(
            this.add.bitmapText(
                this.sys.canvas.width / 2 - 22,
                this.sys.canvas.height / 2 + 55,
                'font',
                'retry - R',
                30
            )
        );
        this.bitmapTexts.push(
            this.add.bitmapText(
                this.sys.canvas.width / 2 - 22,
                this.sys.canvas.height / 2 + 105,
                'font',
                'Exit - E',
                30
            )
        );
    }

    update(): void {
        if (this.retryKey.isDown) {
            this.registry.set('score', 0);
            this.registry.set('coins', 0);
            this.registry.set('lives', 2);
            this.registry.set('time', 400);

            this.registry.set('marioSize', 'small');
            this.scene.start('HUDScene');
            this.scene.start('GameScene');
            this.scene.bringToTop('HUDScene');
        }
        if (this.exitKey.isDown) {
            this.scene.start('StartScene');

        }
    }

}
