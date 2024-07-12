import { BOARD_HEIGHT, BOARD_WIDTH, GAP, PADDING, SCREEN_WIDTH, TILE_SIZE } from '../../constants'
import { Grid, Tile } from '../../objects'
import State from '../State'

class ShuffleState extends State {
    private grid: Grid
    private scene: Phaser.Scene
    private tileGroup: Phaser.GameObjects.Group
    private circle: Phaser.Geom.Circle
    private elapsedTime: number
    private spawned: boolean
    constructor(grid: Grid, scene: Phaser.Scene) {
        super()
        this.grid = grid
        this.scene = scene
        this.tileGroup = this.scene.add.group()
        this.circle = new Phaser.Geom.Circle(SCREEN_WIDTH / 2, 300, 64)
        this.elapsedTime = 0
        this.spawned = false
    }

    public enter(): void {
        console.log('ShuffleState: enter')
        const tileGrid = this.grid.getTileGrid()
        this.tileGroup.clear(true, true)
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            // tileGrid[y] = []
            if (!tileGrid[y]) tileGrid[y] = []
            for (let x = 0; x < BOARD_WIDTH; x++) {
                if (tileGrid[y][x] !== undefined) {
                    const tile: Tile = tileGrid[y][x] as Tile
                    this.grid.remove(tile)
                    this.grid.remove(tile.emitter)
                    tile.destroy()
                }
                // if (!this.spawned) {
                const tile = this.grid.addTile(x, y)
                tileGrid[y][x] = tile
                // this.grid.add(tile)
                // this.grid.add(tile.emitter)
                this.tileGroup.add(tile)
                // }
            }
        }
        // for (let y = 0; y < BOARD_HEIGHT; y++) {
        //     // tileGrid[y] = []
        //     // if (!tileGrid[y]) tileGrid[y] = []
        //     for (let x = 0; x < BOARD_WIDTH; x++) {
        //         const tile = tileGrid[y][x]
        //         if (tile) {
        //             this.tileGroup.add(tile)
        //         }
        //         // }
        //     }
        // }
        // for(let y = 0; y < BOARD_HEIGHT; y++) {
        //     for(let x = 0; x < BOARD_WIDTH; x++) {
        //         const tile = this.grid.addTile(x, y)
        //         tile = tileGrid[y][x]
        //         this.grid.add(tile)
        //         this.grid.add(tile.emitter)
        //         this.tileGroup.add(tile)
        //     }
        // }
        this.spawned = true
        Phaser.Actions.PlaceOnCircle(this.tileGroup.getChildren(), this.circle)
        this.scene.tweens.add({
            targets: this.circle,
            radius: 228,
            ease: 'Quintic.easeInOut',
            duration: 2000,
            repeat: 0,
            onUpdate: () => {
                Phaser.Actions.RotateAroundDistance(
                    this.tileGroup.getChildren(),
                    { x: 400, y: 300 },
                    0.1,
                    this.circle.radius
                )
            },
            onComplete: () => {
                console.log('tween complete')
                for (let y = 0; y < tileGrid.length; y++) {
                    for (let x = 0; x < tileGrid[y].length; x++) {
                        const tile = tileGrid[y][x]
                        if (tile) {
                            tile.state = 'created'
                            this.scene.tweens.add({
                                targets: tile,
                                x: PADDING + x * (TILE_SIZE + GAP) + TILE_SIZE / 2,
                                y: PADDING + y * (TILE_SIZE + GAP) + TILE_SIZE / 2,
                                ease: 'Cubic.easeInOut',
                                duration: 300,
                                delay: 100 * y + x * 50,
                                repeat: 0,
                                yoyo: false,
                                onComplete: () => {
                                    tile.state = 'spawned'
                                },
                            })
                        }
                    }
                }
                // this.checkMatches()
                // this.stateMachine.transition('play')
            },
        })
    }

    public exit(): void {
        console.log('ShuffleState: exit')
        this.elapsedTime = 0
    }

    public execute(time: number, delta: number): void {
        this.elapsedTime += delta
        if (this.elapsedTime >= 2000 + 300 + 100 * (BOARD_HEIGHT - 1) + (BOARD_WIDTH - 1) * 50) {
            this.stateMachine.transition('match')
        }
        console.log('ShuffleState: update')
    }
}

export default ShuffleState
