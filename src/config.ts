import { SCREEN_HEIGHT, SCREEN_WIDTH } from './constants'
import { GameScene, LoadingScene } from './scenes'

const CONFIG: Phaser.Types.Core.GameConfig = {
    title: 'Jelly Crush',
    type: Phaser.AUTO,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    parent: 'game',
    scene: [LoadingScene, GameScene],
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
}

export default CONFIG
