import { ScoreManager } from '../../managers'
import { Grid } from '../../objects'
import State from '../State'

class MatchState extends State {
    private grid: Grid
    private scene: Phaser.Scene
    private elapsedTime: number
    private scoreManager: ScoreManager
    constructor(grid: Grid, scene: Phaser.Scene) {
        super()
        this.grid = grid
        this.scene = scene
        this.elapsedTime = 0
        this.scoreManager = ScoreManager.getInstance(this.scene)
    }

    public enter(): void {
        console.log('MoveState: enter')
        const match = this.grid.checkMatches()
        if (!match) {
            // const score = this.scoreManager.getScore()
            // const milestone = this.scoreManager.getMilestone()
            // console.log(score, milestone)
            // if (score >= milestone) {
            //     console.log('Its shuffle time')
            //     this.stateMachine.transition('shuffle')
            // } else {
            //     console.log('Its play time')
            //     this.stateMachine.transition('play')
            // }
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
                // const score = this.scoreManager.getScore()
                // const milestone = this.scoreManager.getMilestone()
                // console.log(score, milestone)
                // if (score >= milestone) {
                //     console.log('Its shuffle time')
                //     this.stateMachine.transition('shuffle')
                // } else {
                //     console.log('Its play time')
                //     this.stateMachine.transition('play')
                // }
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
