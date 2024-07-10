import { Grid } from '../../objects'
import State from '../State'

class PlayState extends State {
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
        console.log('PlayState: enter')
        this.grid.getTileGrid().forEach(row => {
            row.forEach(tile => {
                if (tile) {
                    tile.setInteractive()
                }
            })
        })
    }

    public exit(): void {
        console.log('PlayState: exit')
        this.grid.getFirstHintBox().setVisible(false)
        this.grid.getSecondHintBox().setVisible(false)
        this.elapsedTime = 0
        this.grid.getTileGrid().forEach(row => {
            row.forEach(tile => {
                if (tile) {
                    tile.disableInteractive()
                }
            })
        })
    }

    public execute(time: number, delta: number): void {
        this.elapsedTime += delta
        if (this.elapsedTime > 10000) {
            this.grid.getFirstHintBox().setVisible(true)
            this.grid.getSecondHintBox().setVisible(true)
        }
        console.log('PlayState: update')
    }
}

export default PlayState
