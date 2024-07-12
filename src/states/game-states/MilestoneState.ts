import { ScoreManager } from '../../managers'
import { Grid } from '../../objects'
import State from '../State'

class MilestoneState extends State {
    private grid: Grid
    private scene: Phaser.Scene
    private elapsedTime: number
    private scoreManager: ScoreManager
    private shuffled: boolean
    constructor(grid: Grid, scene: Phaser.Scene) {
        super()
        this.grid = grid
        this.scene = scene
        this.elapsedTime = 0
        this.scoreManager = ScoreManager.getInstance(this.scene)
        this.shuffled = false
    }
    public enter(): void {
        console.log('MilestoneState: enter')
        // this.grid.stateMachine.transition('shuffle')
        this.scoreManager.setMilestone(this.scoreManager.getScore() - this.scoreManager.getScore() % 1000 + 1000)
    }

    public exit(): void {
        console.log('MilestoneState: exit')
        this.elapsedTime = 0
        this.shuffled = false
    }

    public execute(time: number, delta: number): void {
        this.elapsedTime += delta
        if (this.elapsedTime > 2000 && !this.shuffled) {
            this.grid.stateMachine.transition('shuffle')
            this.scoreManager.setMilestone(this.scoreManager.getMilestone() + 1000)
            this.shuffled = true
        }
        // console.log('MilestoneState: execute')
        if (this.elapsedTime > 3000 && this.grid.stateMachine.getState() === 'play') {
            this.stateMachine.transition('play')
        }
    }
}

export default MilestoneState
