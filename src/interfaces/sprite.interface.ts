import { GameScene } from "../scenes/GameScene";

export interface ISpriteConstructor {
    scene: GameScene;
    x: number;
    y: number;
    texture: string;
    frame?: string | number;
}
