import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../constants'
import { ScoreManager } from '../managers'
import { Grid, Milestone } from '../objects'
import { PlayState, MilestoneState } from '../states/game-states'
import StateMachine from '../states/StateMachine'

class GameScene extends Phaser.Scene {
    private grid: Grid
    private scoreText: Phaser.GameObjects.Text
    private scoreManager: ScoreManager
    private milestone: Milestone
    private stateMachine: StateMachine
    constructor() {
        super('GameScene')
    }

    init(): void {
        this.cameras.main.setBackgroundColor('#24252A')
        const background = this.add.image(0, 0, 'roomBackground')
        background.setOrigin(0, 0)
        background.setScale(0.54)
        const topbar = this.add.image(0, 0, 'topBar')
        topbar.setOrigin(0.5)
        // Phaser.Display.Align.In.Center(this.grid, this.add.zone(0, 0, 800, 1200))
        topbar.setScale(SCREEN_WIDTH / topbar.width)
        this.scoreManager = ScoreManager.getInstance(this)
        this.scoreText = this.scoreManager.getScoreText()
        this.scoreText.setDepth(5)
        const scoreLabel = this.add.image(0, 0, 'score')
        scoreLabel.setOrigin(0.5)
        scoreLabel.setDepth(5)
        Phaser.Display.Align.In.TopCenter(topbar, this.add.zone(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_WIDTH, SCREEN_HEIGHT), 0, 180)
        Phaser.Display.Align.In.BottomCenter(this.scoreText, topbar, 0, -350)
        Phaser.Display.Align.In.TopCenter(scoreLabel, topbar, 0, -250)
        this.milestone = new Milestone(this)
        this.milestone.setScale(0.8)
        // this.milestone.setPosition(SCREEN_WIDTH / 2, 100)
        Phaser.Display.Align.In.LeftCenter(this.milestone, topbar, -370, 70)
        this.grid = new Grid(this)
        this.grid.setPosition(SCREEN_WIDTH / 2 - this.grid.width / 2, 500)
        const mask = this.make
            .graphics()
            .fillRect(this.grid.x, this.grid.y, this.grid.width, this.grid.height)
        this.grid.setMask(new Phaser.Display.Masks.GeometryMask(this, mask))
        this.stateMachine = new StateMachine('play', {
            play: new PlayState(this.grid, this),
            milestone: new MilestoneState(this.grid, this),
        })
    }

    create(): void {
        return
    }

    update(time: number, delta: number): void {
        this.grid.update(time, delta)
        this.scoreManager.update()
        this.milestone.update()
        this.stateMachine.update(time, delta)
    }
}

export default GameScene
