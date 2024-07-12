import { Grid } from '../../objects'
import State from '../State'

class FillState extends State {
    private grid: Grid
    private scene: Phaser.Scene
    private elapsedTime: number
    public filled: boolean
    constructor(grid: Grid, scene: Phaser.Scene) {
        super()
        this.grid = grid
        this.scene = scene
        this.elapsedTime = 0
        this.filled = false
    }
    enter(): void {
        this.grid.resetTile()
        this.grid.fillTile()
    }
    exit(): void {
        console.log('FillState: exit')
        this.elapsedTime = 0
        this.filled = false
    }
    execute(time: number, delta: number): void {
        console.log('FillState: update')
        const tileGrid = this.grid.getTileGrid()
        if (tileGrid.every((row) => row.every((tile) => tile && (tile.state == 'moving' || tile.state == 'spawned')))) {
            this.grid.fillTile()
            this.filled = true
        }
        if (tileGrid.every((row) => row.every((tile) => tile && tile.state == 'spawned')) && this.filled) {
            this.stateMachine.transition('match')
        }
    }
}

export default FillState
