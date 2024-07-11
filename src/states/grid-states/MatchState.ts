import { Grid } from '../../objects'
import State from '../State'

class MatchState extends State {
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
        console.log('MoveState: enter')
        const match = this.grid.checkMatches()
        if (!match) {
            this.stateMachine.transition('play')
        } else {
            this.stateMachine.transition('fill')
        }
    }

    public exit(): void {
        console.log('MoveState: exit')
        this.elapsedTime = 0
    }

    public execute(time: number, delta: number): void {
        this.elapsedTime += delta
        if (this.elapsedTime > 1000) {
            const match = this.grid.checkMatches()
            if (!match) {
                this.stateMachine.transition('play')
            } else {
                this.stateMachine.transition('fill')
            }
            this.elapsedTime = 0
        }
        console.log('MoveState: update')
    }
}

export default MatchState
