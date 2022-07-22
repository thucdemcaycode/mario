import { Constants } from "../helpers/Contants"
import { MenuButton } from "../objects/buttons/MenuButton"

export class OverMenu extends Phaser.Scene {
    private background: Phaser.GameObjects.Image
    private over: Phaser.GameObjects.Image
    private restartButton: MenuButton
    private exitButton: MenuButton
    private scoreImg: Phaser.GameObjects.Image
    private scoreText: Phaser.GameObjects.Text
    private highScoreImg: Phaser.GameObjects.Image
    private highScoreText: Phaser.GameObjects.Text

    private container: Phaser.GameObjects.Container

    private zone: Phaser.GameObjects.Zone

    constructor() {
        super({
            key: "OverMenu"
        })
    }

    create(): void {
        this.createZone()

        this.createMenu()

        this.createContainer()

        this.inputHandler()
    }

    private createZone() {
        const width = this.sys.canvas.width
        const height = this.sys.canvas.height

        this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0, 0)

        this.zone = this.add.zone(0, 0, width, height).setOrigin(0, 0)
    }

    private createMenu() {
        this.background = this.add.image(0, 0, "back").setScale(1.1, 1.9)

        // this.createMessage()

        // this.scoreImg = this.add.image(-150, -65, "score").setScale(0.4)
        // this.scoreText = this.add
        //     .text(0, -70, "", {
        //         fontSize: "40px",
        //         fontFamily: "Revalia",
        //         align: "center",
        //         stroke: "#000000",
        //         strokeThickness: 2
        //     })
        //     .setAlign("center")
        //     .setOrigin(0.5, 0.5)

        // this.highScoreImg = this.add.image(-150, 80, "high").setScale(0.4)
        // this.highScoreText = this.add
        //     .text(0, 75, "", {
        //         fontSize: "40px",
        //         fontFamily: "Revalia",
        //         align: "center",
        //         stroke: "#000000",
        //         strokeThickness: 2
        //     })
        //     .setAlign("center")
        //     .setOrigin(0.5, 0.5)

        this.restartButton = new MenuButton({
            scene: this,
            x: 50,
            y: -40,
            texture: "newgame"
        }).setScale(0.4)
        this.exitButton = new MenuButton({
            scene: this,
            x: 50,
            y: 50,
            texture: "exit"
        }).setScale(0.4)
    }

    private createMessage() {
        const isWinning: boolean = this.registry.get("status") == "win"
        const isReachNewBest: boolean =
            this.registry.get("score") != 0 &&
            this.registry.get("score") == (this.registry.get("highScore") || 0)

        if (isWinning) {
            this.over = this.add.image(0, -300, "victory").setScale(0.4)
        } else if (isReachNewBest) {
            this.over = this.add.image(0, -350, "congrat").setScale(0.4)
        } else {
            this.over = this.add.image(0, -400, "overimg").setScale(0.4)
        }
    }

    private createContainer() {
        this.container = this.add.container(0, 0, [
            // this.over,
            this.background,
            // this.scoreImg,
            // this.scoreText,
            // this.highScoreImg,
            // this.highScoreText,
            this.restartButton,
            this.exitButton
        ])
        Phaser.Display.Align.In.Center(this.container, this.zone)

        this.tweens.add({
            targets: this.container,
            scale: {
                from: 0,
                to: 1
            },
            duration: 300,
            ease: "Linear",
            onComplete: () => {
                // this.createScoreAnimation()
            }
        })
    }

    private createScoreAnimation() {
        this.tweens.add({
            targets: [this.scoreText, this.highScoreText],
            scaleX: 1.2,
            scaleY: 1.2,
            yoyo: true,
            duration: 500
        })

        let score = this.registry.get("score") || 0
        let highScore = this.registry.get("highScore") || 0
        this.tweenCountScore(score, highScore)
        this.emitCongrats(score, highScore)
    }

    private tweenCountScore(score: number, highScore: number) {
        this.tweens.addCounter({
            from: 0,
            to: score,
            duration: 1000,
            onUpdate: (tween) => {
                this.scoreText.setText(Math.floor(tween.getValue()).toString())
            }
        })
        this.tweens.addCounter({
            from: 0,
            to: highScore,
            duration: 1000,
            onUpdate: (tween) => {
                this.highScoreText.setText(
                    Math.floor(tween.getValue()).toString()
                )
            }
        })
    }

    private emitCongrats(score: number, highScore: number) {
        this.time.delayedCall(1250, () => {
            if (score == highScore && score != 0) {
                // this.sound.play("yeah")
                this.emitGlowEmitter()
                this.emitFirework()
            } else {
                // this.sound.play("over")
            }
        })
    }

    private emitGlowEmitter() {
        let logoSource = {
            getRandomPoint: (vec: any) => {
                let x = Phaser.Math.Between(0, this.sys.canvas.width)
                let y = Phaser.Math.Between(0, this.sys.canvas.height)

                return vec.setTo(x, y)
            }
        }

        this.add.particles("flares").createEmitter({
            x: 0,
            y: 0,
            lifespan: 1000,
            gravityY: 10,
            scale: { start: 0, end: 0.5, ease: "Quad.easeOut" },
            alpha: { start: 1, end: 0, ease: "Quad.easeIn" },
            blendMode: "ADD",
            emitZone: { type: "random", source: logoSource }
        })
    }

    private emitFirework() {
        const firework = this.add.particles("flares").createEmitter({
            alpha: { start: 1, end: 0, ease: "Cubic.easeIn" },
            angle: { start: 0, end: 360, steps: 100 },
            blendMode: "ADD",
            frame: {
                frames: ["red", "yellow", "green", "blue"],
                cycle: true,
                quantity: 500
            },
            frequency: 2000,
            gravityY: 300,
            lifespan: 1000,
            quantity: 500,
            reserve: 500,
            scale: { min: 0.05, max: 0.15 },
            speed: { min: 300, max: 600 },
            x: 300,
            y: 300
        })

        this.time.addEvent({
            delay: 1000,
            repeat: -1,
            callback: () => {
                const x = Phaser.Math.Between(50, this.sys.canvas.width)
                const y = Phaser.Math.Between(50, this.sys.canvas.height)
                firework.setPosition(x, y)
            }
        })
    }

    private inputHandler() {
        this.restartButton.onClick(this.restartFunction)

        this.exitButton.onClick(this.exitFunction)
    }

    private restartFunction = () => {
        this.restartButton.setScale(0.4)
        // this.sound.play("click")
        this.tweens.add({
            targets: this.container,
            scale: {
                from: 1,
                to: 0
            },
            duration: 250,
            ease: "Linear",
            onComplete: () => {
                // this.scene.get("GameScene").events.off(Constants.EVENT_NEW_FISH)
                // this.scene
                //     .get("GameScene")
                //     .events.off(Constants.EVENT_FISH_SCORE)
                this.scene.stop()
                this.scene.resume("GameScene")
            }
        })
    }

    private exitFunction = () => {
        this.exitButton.setScale(0.4)
        // this.sound.play("click")
        this.tweens.add({
            targets: this.container,
            scale: {
                from: 1,
                to: 0
            },
            duration: 250,
            ease: "Linear",
            onComplete: () => {
                this.scene.get("GameScene").events.off(Constants.EVENT_NEW_FISH)
                this.scene
                    .get("GameScene")
                    .events.off(Constants.EVENT_FISH_SCORE)
                this.scene.start("HUDScene")
                this.scene.start("GameScene")
                this.scene.bringToTop("HUDScene")
                this.scene.stop()
            },
            delay: 100
        })
    }
}
