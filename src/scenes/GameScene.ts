import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../constants'
import { Grid } from '../objects'

class GameScene extends Phaser.Scene {
    private grid: Grid
    constructor() {
        super('GameScene')
    }

    init(): void {
        this.cameras.main.setBackgroundColor('#24252A')
        const background = this.add.image(0, 0, 'roomBackground')
        background.setOrigin(0, 0)
        background.setScale(0.54)
        this.grid = new Grid(this)
        const topbar = this.add.image(0, 0, 'topBar')
        topbar.setOrigin(0, 0)
        // Phaser.Display.Align.In.Center(this.grid, this.add.zone(0, 0, 800, 1200))
        topbar.setScale(SCREEN_WIDTH / topbar.width)
        this.grid.setPosition(SCREEN_WIDTH /2 - this.grid.width / 2, 500)
        const mask = this.make.graphics().fillRect(this.grid.x, this.grid.y, this.grid.width, this.grid.height)
        this.grid.setMask(new Phaser.Display.Masks.GeometryMask(this, mask))
    }

    create(): void {
        return
    }

    update(time: number, delta: number): void {
        this.grid.update(time, delta)
    }
}

export default GameScene
