import { ScoreManager } from '../../managers'
import { Grid } from '../../objects'
import State from '../State'

class PlayState extends State {
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
        console.log('GamePlayState: enter')
    }

    public exit(): void {
        console.log('GamePlayState: exit')
        this.elapsedTime = 0
    }

    public execute(time: number, delta: number): void {
        this.elapsedTime += delta
        if (this.elapsedTime > 5000) {
            // console.log('PlayState: execute')
        }
        const score = this.scoreManager.getScore()
        const milestone = this.scoreManager.getMilestone()
        if (score >= milestone && this.grid.stateMachine.getState() === 'play') {
            console.log('GamePlayState: milestone reached')
            this.stateMachine.transition('milestone')
            // this.scoreManager.setMilestone(milestone + 1000)
        }
    }
}

export default PlayState
