import { LoadScene } from './scenes/LoadScene';
import { GameScene } from './scenes/GameScene';
import { HUDScene } from './scenes/HudScene';
import { StartScene } from './scenes/StartScene';
import { LevelScene } from './scenes/LevelScene';
import { OverScene } from './scenes/OverScene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Super Mario Land',
    url: 'https://github.com/digitsensitive/phaser3-typescript',
    version: '2.0',
    width: 1200,
    height: 700,
    type: Phaser.AUTO,
    parent: 'game',
    scene: [LoadScene, StartScene, LevelScene, HUDScene, GameScene, OverScene],
    input: {
        keyboard: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 550 },
            debug: false
        }
    },
    backgroundColor: '#f8f8f8',
    render: { pixelArt: true, antialias: false }
};
