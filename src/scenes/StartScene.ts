export class StartScene extends Phaser.Scene {
    private startKey: Phaser.Input.Keyboard.Key;
    private levelKey: Phaser.Input.Keyboard.Key;
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];

    constructor() {
        super({
            key: 'StartScene'
        });
    }

    init(): void {
        this.startKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.S
        );
        this.levelKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.L
        );
        this.startKey.isDown = false;
        this.levelKey.isDown = false;

        this.initGlobalDataManager();
    }

    create(): void {
        this.add.image(0, 0, 'title').setOrigin(0, 0);

        this.bitmapTexts.push(
            this.add.bitmapText(
                this.sys.canvas.width / 2 - 22,
                this.sys.canvas.height / 2 + 55,
                'font',
                'START - S',
                30
            )
        );
        this.bitmapTexts.push(
            this.add.bitmapText(
                this.sys.canvas.width / 2 - 22,
                this.sys.canvas.height / 2 + 105,
                'font',
                'LEVEL - L',
                30
            )
        );
    }

    update(): void {
        if (this.startKey.isDown) {
            this.scene.start('HUDScene');
            this.scene.start('GameScene');
            this.scene.bringToTop('HUDScene');
        }
        if (this.levelKey.isDown) {
            this.scene.start('LevelScene');

        }
    }

    private initGlobalDataManager(): void {
        this.registry.set('time', 400);
        this.registry.set('worldTime', 'WORLD TIME');
        this.registry.set('score', 0);
        this.registry.set('coins', 0);
        this.registry.set('lives', 1);
        this.registry.set('spawn', { x: 12, y: 44, dir: 'down' });
        this.registry.set('marioSize', 'small');
    }

}
