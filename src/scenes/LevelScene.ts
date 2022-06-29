export class LevelScene extends Phaser.Scene {
    private oneKey: Phaser.Input.Keyboard.Key;
    private twoKey: Phaser.Input.Keyboard.Key;
    private threeKey: Phaser.Input.Keyboard.Key;
    private fourKey: Phaser.Input.Keyboard.Key;

    private levels: number[] = [1, 2, 3, 4];
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];
    startKey: any;

    constructor() {
        super({
            key: 'LevelScene'
        });
    }

    init(): void {

    }

    create(): void {
        this.add.image(0, 0, 'title').setOrigin(0, 0);

        this.createInput();

        this.createText();

    }

    createInput() {
        this.oneKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ONE
        );
        this.twoKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.TWO
        );
        this.threeKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.THREE
        );
        this.fourKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.FOUR
        );
    }

    createText() {
        this.bitmapTexts.push(
            this.add.bitmapText(
                this.sys.canvas.width / 2 - 22,
                this.sys.canvas.height / 2 + 55,
                'font',
                'Level',
                30
            )
        )
        for (const lv of this.levels) {
            this.bitmapTexts.push(
                this.add.bitmapText(
                    this.sys.canvas.width / 2 + (lv - 3) * 50 + 75,
                    this.sys.canvas.height / 2 + 100,
                    'font',
                    lv.toString(),
                    30
                )
            )
        }
    }

    update(): void {
        if (this.oneKey.isDown) {
            this.registry.set('level', 'level1');
            this.registry.set('world', '1-1');

            this.play()
        }
        if (this.twoKey.isDown) {
            this.registry.set('level', 'level2');
            this.registry.set('world', '1-2');

            this.play()
        }
        if (this.threeKey.isDown) {
            this.registry.set('level', 'level3');
            this.registry.set('world', '1-3');

            this.play()
        }
        if (this.fourKey.isDown) {
            this.registry.set('level', 'level4');
            this.registry.set('world', 'Full');

            this.play()
        }

    }
    play() {
        this.scene.start('HUDScene');
        this.scene.start('GameScene');
        this.scene.bringToTop('HUDScene');
    }


}
