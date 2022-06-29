import { Boss } from '../objects/boss';
import { Box } from '../objects/box';
import { Brick } from '../objects/brick';
import { Cloud } from '../objects/cloud';
import { Collectible } from '../objects/collectible';
import { Enemy } from '../objects/enemy';
import { Fireball } from '../objects/fireball';
import { FlowerMonster } from '../objects/flowerMonster';
import { Goomba } from '../objects/goomba';
import { Kappa } from '../objects/kappa';
import { Mario } from '../objects/mario';
import { Platform } from '../objects/platform';
import { Portal } from '../objects/portal';
import { Princess } from '../objects/princess';

export class GameScene extends Phaser.Scene {
    // tilemap
    private map: Phaser.Tilemaps.Tilemap;
    private tileset: Phaser.Tilemaps.Tileset;
    private backgroundLayer: Phaser.Tilemaps.TilemapLayer;
    private foregroundLayer: Phaser.Tilemaps.TilemapLayer;

    // game objects
    private boxes: Phaser.GameObjects.Group;
    private bricks: Phaser.GameObjects.Group;
    private collectibles: Phaser.GameObjects.Group;
    private enemies: Phaser.GameObjects.Group;
    private platforms: Phaser.GameObjects.Group;
    private princess: Princess;
    private player: Mario;
    private portals: Phaser.GameObjects.Group;

    constructor() {
        super({
            key: 'GameScene'
        });
    }

    preload() {
        // Load animation tiles plugin
        this.load.scenePlugin('AnimatedTiles', 'https://raw.githubusercontent.com/nkholski/phaser-animated-tiles/master/dist/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    init(): void { }

    create(): void {
        // *****************************************************************
        // SETUP TILEMAP
        // *****************************************************************
        this.createMap();
        this.createTileset()
        this.createLayer();


        // *****************************************************************
        // GAME OBJECTS
        // *****************************************************************
        this.createGameObjects();


        this.loadObjectsFromTilemap();

        // *****************************************************************
        // COLLIDERS
        // *****************************************************************
        this.createColliders();


        // *****************************************************************
        // CAMERA
        // *****************************************************************
        this.createCamera();
    }

    createMap() {
        // create our tilemap from Tiled JSON
        this.map = this.make.tilemap({ key: this.registry.get('level') });
    }
    createTileset() {
        // add our tileset and layers to our tilemap
        this.tileset = this.map.addTilesetImage('tile');
    }
    createLayer() {
        // add our tileset and layers to our tilemap
        this.backgroundLayer = this.map.createLayer(
            'backgroundLayer',
            this.tileset,
            0,
            0
        );

        this.foregroundLayer = this.map.createLayer(
            'foregroundLayer',
            this.tileset,
            0,
            0
        );
        this.foregroundLayer.setName('foregroundLayer');


        // set collision for tiles with the property collide set to true
        this.foregroundLayer.setCollisionByProperty({ collide: true });

        //@ts-ignore
        this.animatedTiles.init(this.map)

    }
    createGameObjects() {
        this.portals = this.add.group({
            /*classType: Portal,*/
            runChildUpdate: true
        });

        this.boxes = this.add.group({
            /*classType: Box,*/
            runChildUpdate: true
        });

        this.bricks = this.add.group({
            /*classType: Brick,*/
            runChildUpdate: true
        });

        this.collectibles = this.add.group({
            /*classType: Collectible,*/
            runChildUpdate: true
        });

        this.enemies = this.add.group({
            runChildUpdate: true
        });

        this.platforms = this.add.group({
            /*classType: Platform,*/
            runChildUpdate: true
        });
    }

    createColliders() {
        this.physics.add.collider(this.player, this.foregroundLayer);
        this.physics.add.collider(this.player.fireballs, this.foregroundLayer);
        this.physics.add.collider(this.enemies, this.foregroundLayer);
        this.physics.add.collider(this.enemies, this.boxes);
        this.physics.add.collider(this.enemies, this.bricks);
        this.physics.add.collider(this.player, this.bricks);

        this.physics.add.collider(
            this.player,
            this.boxes,
            this.playerHitBox,
            null,
            this
        );

        this.physics.add.overlap(
            this.player.fireballs,
            this.enemies,
            this.handleFireballEnemy,
            null,
            this
        )

        this.physics.add.overlap(
            this.player,
            this.enemies,
            this.handlePlayerEnemyOverlap,
            null,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.portals,
            this.handlePlayerPortalOverlap,
            null,
            this
        );

        this.physics.add.collider(
            this.player,
            this.platforms,
            this.handlePlayerOnPlatform,
            null,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.collectibles,
            this.handlePlayerCollectiblesOverlap,
            null,
            this
        );
    }
    createCamera() {
        this.cameras.main.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        this.cameras.main.setZoom(2.4);
    }

    update(): void {
        this.player.update();
        if (this.princess) {
            this.princess.update();
        }
    }

    private loadObjectsFromTilemap(): void {
        // get the object layer in the tilemap named 'objects'
        const objects = this.map.getObjectLayer('objects').objects as any[];

        objects.forEach((object) => {
            if (object.type === 'portal') {
                let dir = object.properties[0].value
                let marioSpawnX = object.properties[1].value
                let marioSpawnY = object.properties[2].value
                this.portals.add(
                    new Portal({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        height: object.width,
                        width: object.height,
                        spawn: {
                            x: marioSpawnX,
                            y: marioSpawnY,
                            dir: dir
                        }
                    }).setName(object.name)
                );
            }

            if (object.type === 'player') {
                this.player = new Mario({
                    scene: this,
                    // x: this.registry.get('spawn').x,
                    // y: this.registry.get('spawn').y,
                    // texture: 'mario'
                    x: object.x,
                    y: object.y,
                    texture: 'mario'
                });
            }

            if (object.type === 'princess') {
                this.princess = new Princess({
                    scene: this,
                    x: object.x,
                    y: object.y,
                    texture: 'princess'
                });
                this.physics.add.collider(this.princess, this.foregroundLayer);
                this.physics.add.collider(
                    this.player,
                    this.princess,
                    this.handleMeetPrincess,
                    null,
                    this
                );
            }

            if (object.type === 'goomba') {
                this.enemies.add(
                    new Goomba({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: 'goomba'
                    })
                );
            }

            if (object.type === 'kappa') {
                this.enemies.add(
                    new Kappa({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: 'kappa'
                    })
                );
            }

            if (object.type === 'cloud') {
                this.enemies.add(
                    new Cloud({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: 'cloud'
                    })
                );
            }

            if (object.type === 'flower_monster') {
                this.enemies.add(
                    new FlowerMonster({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: 'flower_monster'
                    })
                );
            }

            if (object.type === 'boss') {
                const boss = new Boss({
                    scene: this,
                    x: object.x,
                    y: object.y,
                    texture: 'boss'
                })
                this.enemies.add(
                    boss
                );
                this.physics.add.overlap(this.player, boss.hammers, () => {
                    if (this.player.getVulnerable()) {
                        this.player.gotHit();
                    }
                })
            }

            if (object.type === 'brick') {
                this.bricks.add(
                    new Brick({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: 'brick',
                        value: 50
                    })
                );
            }

            if (object.type === 'box') {
                this.boxes.add(
                    new Box({
                        scene: this,
                        content: object.properties[0].value,
                        x: object.x,
                        y: object.y,
                        texture: 'box'
                    })
                );
            }

            if (object.type === 'collectible') {
                this.collectibles.add(
                    new Collectible({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: object.properties[0].value,
                        points: 100
                    })
                );
            }

            if (object.type === 'platformMovingUpAndDown') {
                this.platforms.add(
                    new Platform({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: 'platform',
                        tweenProps: {
                            y: {
                                value: 50,
                                duration: 1500,
                                ease: 'Power0'
                            }
                        },
                        frame: 1
                    })
                );
            }

            if (object.type === 'platformMovingLeftAndRight') {
                this.platforms.add(
                    new Platform({
                        scene: this,
                        x: object.x,
                        y: object.y,
                        texture: 'platform',
                        tweenProps: {
                            x: {
                                value: object.x + 50,
                                duration: 1200,
                                ease: 'Power0'
                            }
                        }
                        ,
                        frame: 2
                    })
                );
            }
        });
    }

    public addEnemy(enemy: Enemy) {
        this.enemies.add(enemy);
    }

    /**
     * Player <-> Enemy Overlap
     * @param fireball [Fireball]
     * @param _enemy  [Enemy]
     */
    private handleFireballEnemy(fireball: Fireball, _enemy: Enemy): void {
        this.sound.play('kick');
        fireball.collideEnemy();
        _enemy.gotHitFromBulletOrMarioFlower();
    }

    private handlePlayerEnemyOverlap(_player: Mario, _enemy: Enemy): void {
        if (_player.body.touching.down && _enemy.body.touching.up && _enemy.name != 'flower_monster' && _enemy.name != 'gai') {
            // player hit enemy on top
            this.sound.play('kick');
            _player.bounceUpAfterHitEnemyOnHead();
            _enemy.gotHitOnHead();
        } else {
            // player got hit from the side or on the head
            if (_player.getVulnerable()) {
                _player.gotHit();
            }
        }
    }

    /**
     * Player <-> Box Collision
     * @param _player [Mario]
     * @param _box    [Box]
     */
    private playerHitBox(_player: Mario, _box: Box): void {
        if (_box.body.touching.down && _box.active) {
            // ok, mario has really hit a box on the downside
            _box.yoyoTheBoxUpAndDown();
            this.collectibles.add(_box.spawnBoxContent());

            switch (_box.getBoxContentString()) {
                // have a look what is inside the box! Christmas time!
                case 'coin': {
                    _box.tweenBoxContent({ y: _box.y - 40, alpha: 0 }, 700, function () {
                        _box.getContent().destroy();
                    });
                    this.sound.play('coin');

                    _box.addCoinAndScore(1, 100);
                    break;
                }
                case 'rotatingCoin': {
                    _box.tweenBoxContent({ y: _box.y - 40, alpha: 0 }, 700, function () {
                        _box.getContent().destroy();
                    });
                    this.sound.play('coin');

                    _box.addCoinAndScore(1, 100);
                    break;
                }
                case 'flower': {
                    _box.tweenBoxContent({ y: _box.y - 8 }, 200, function () {
                        _box.getContent().y -= 8;
                        _box.getContent().anims.play('flower');
                    });

                    break;
                }
                case 'mushroom': {
                    _box.popUpCollectible();
                    break;
                }
                case 'star': {
                    _box.popUpCollectible();
                    break;
                }
                default: {
                    break;
                }
            }
            _box.startHitTimeline();
        }
    }

    private handlePlayerPortalOverlap(_player: Mario, _portal: Portal): void {
        if (
            (_player.getKeys().get('DOWN').isDown &&
                _portal.getPortalDestination().dir === 'down') ||
            (_player.getKeys().get('RIGHT').isDown &&
                _portal.getPortalDestination().dir === 'right')
        ) {
            // set new level and new destination for mario
            this.registry.set('level', _portal.name);
            this.sound.play('stage_clear');
            this.registry.set('spawn', {
                x: _portal.getPortalDestination().x,
                y: _portal.getPortalDestination().y,
                dir: _portal.getPortalDestination().dir
            });
            this.registry.set('time', 400);
            // restart the game scene
            this.scene.restart();
        } else if (_portal.name === 'exit') {
            this.scene.stop('GameScene');
            this.scene.stop('HUDScene');
            this.scene.start('StartScene');
        }
    }

    private handlePlayerCollectiblesOverlap(
        _player: Mario,
        _collectible: Collectible
    ): void {
        switch (_collectible.texture.key) {
            case 'flower': {
                this.sound.play('flower_up')
                _player.marioHasFlower();
                break;
            }
            case 'mushroom': {
                this.sound.play('power_up')
                _player.growMario();
                break;
            }
            case 'star': {
                break;
            }
            default: {
                break;
            }
        }
        _collectible.collected();
    }

    // TODO!!!
    private handlePlayerOnPlatform(player: Mario, platform: Platform): void {
        if (
            platform.body.moves &&
            platform.body.touching.up &&
            player.body.touching.down
        ) {
            player.isOnPlatform = true;
            player.currentPlatform = platform;
        }
    }

    private handleMeetPrincess(player: Mario, princess: Princess) {
        princess.isTouched = true;
    }
}
