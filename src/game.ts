import Phaser from 'phaser'
import CONFIG from './config'

class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        console.log('Game created')
        super(config)
    }
}

window.addEventListener('load', () => {
    const game = new Game(CONFIG)
})
