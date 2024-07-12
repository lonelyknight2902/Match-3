import { GAP, PADDING, TILE_SIZE } from '../../constants'
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
        console.log('PlayState: enter')
        const score = this.scoreManager.getScore()
        const milestone = this.scoreManager.getMilestone()
        console.log(score, milestone)
        if (score >= milestone) {
            console.log('Its shuffle time')
            this.stateMachine.transition('shuffle')
        } else {
            this.grid.getTileGrid().forEach((row) => {
                row.forEach((tile) => {
                    if (tile) {
                        tile.setInteractive()
                    }
                })
            })
            const possibleMoves = this.grid.getPossibleMove(this.grid.getTileGrid())
            if (possibleMoves.length === 0) {
                this.stateMachine.transition('shuffle')
            } else {
                const randomMove = possibleMoves[Phaser.Math.Between(0, possibleMoves.length - 1)]
                const firstHintBox = this.grid.getFirstHintBox()
                const secondHintBox = this.grid.getSecondHintBox()

                firstHintBox.x = PADDING + randomMove.x1 * (TILE_SIZE + GAP)
                firstHintBox.y = PADDING + randomMove.y1 * (TILE_SIZE + GAP)

                secondHintBox.x = PADDING + randomMove.x2 * (TILE_SIZE + GAP)
                secondHintBox.y = PADDING + randomMove.y2 * (TILE_SIZE + GAP)
            }
        }
    }

    public exit(): void {
        console.log('PlayState: exit')
        this.grid.getFirstHintBox().setVisible(false)
        this.grid.getSecondHintBox().setVisible(false)
        this.elapsedTime = 0
        this.grid.getTileGrid().forEach((row) => {
            row.forEach((tile) => {
                if (tile) {
                    tile.disableInteractive()
                }
            })
        })
    }

    public execute(time: number, delta: number): void {
        this.elapsedTime += delta
        if (this.elapsedTime > 5000) {
            this.grid.getFirstHintBox().setVisible(true)
            this.grid.getSecondHintBox().setVisible(true)
        }
        if (this.elapsedTime > 10000) {
            const tileGrid = this.grid.getTileGrid()
            for (let i = 0; i < tileGrid.length; i++) {
                for (let j = 0; j < tileGrid[i].length; j++) {
                    if (tileGrid[i][j]) {
                        this.scene.tweens.add({
                            targets: tileGrid[i][j],
                            displayWidth: TILE_SIZE * 1.2,
                            displayHeight: TILE_SIZE * 1.2,
                            ease: 'Sine.easeInOut',
                            duration: 200,
                            delay: 50 * i + j * 50,
                            yoyo: true,
                            repeat: 0,
                        })
                    }
                }
            }
            // this.grid.getTileGrid().forEach((row) => {
            //     row.forEach((tile) => {
            //         if (tile) {
            //             this.scene.tweens.add({
            //                 targets: tile,
            //                 displayWidth: TILE_SIZE * 1.2,
            //                 displayHeight: TILE_SIZE * 1.2,
            //                 ease: 'Sine.easeInOut',
            //                 duration: 200,
            //                 yoyo: true,
            //                 repeat: 0,
            //             })
            //         }
            //     })
            // })
            this.elapsedTime = 0
        }
        console.log('PlayState: update')
    }
}

export default PlayState
