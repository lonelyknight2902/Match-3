import { Grid } from '../objects'

class GameScene extends Phaser.Scene {
    private grid: Grid
    constructor() {
        super('GameScene')
    }

    init(): void {
        this.cameras.main.setBackgroundColor('#24252A')
        this.grid = new Grid(this)
        Phaser.Display.Align.In.Center(this.grid, this.add.zone(0, 0, 800, 1200))
    }

    create(): void {
        return
    }
}

export default GameScene
