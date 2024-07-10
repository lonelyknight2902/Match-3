import { TILE_SIZE } from '../../constants'
import { Grid } from '../../objects'
import State from '../State'

class SwapState extends State {
    private grid: Grid
    private scene: Phaser.Scene
    private elapsedTime: number
    constructor(grid: Grid, scene: Phaser.Scene) {
        super()
        this.grid = grid
        this.scene = scene
        this.elapsedTime = 0
    }

    public enter(): void {
        console.log('SwapState: enter')
        if (this.grid.getSecondSelectedTile() && this.grid.getFirstSelectedTile()) {
            this.grid.swapTiles()
        }
    }
    public exit(): void {
        console.log('SwapState: exit')
        const firstTile = this.grid.getFirstSelectedTile()
        const secondTile = this.grid.getSecondSelectedTile()
        if (firstTile) {
            this.scene.tweens.killTweensOf(firstTile)
            firstTile.displayWidth = TILE_SIZE
            firstTile.displayHeight = TILE_SIZE
        }

        if (secondTile) {
            this.scene.tweens.killTweensOf(secondTile)
            secondTile.displayWidth = TILE_SIZE
            secondTile.displayHeight = TILE_SIZE
        }
    }
    public execute(time: number, delta: number): void {
        console.log('SwapState: update')
    }
}

export default SwapState
