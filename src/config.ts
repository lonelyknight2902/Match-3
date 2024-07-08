import { GameScene, LoadingScene } from './scenes'

const CONFIG: Phaser.Types.Core.GameConfig = {
    title: 'Space Shooter',
    type: Phaser.AUTO,
    width: 800,
    height: 1200,
    parent: 'game',
    scene: [LoadingScene, GameScene],
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
}

export default CONFIG
