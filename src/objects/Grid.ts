import {
    BOARD_HEIGHT,
    BOARD_WIDTH,
    GAP,
    PADDING,
    T_SHAPE_PATTERN,
    TILE_SIZE,
    TYPES,
} from '../constants'
import { ScoreManager } from '../managers'
import { ExplosionPool, SpecialTileEffectPool, TilesPool } from '../object-pools'
import { ShuffleState, PlayState, MatchState, SwapState, FillState } from '../states/grid-states'
import StateMachine from '../states/StateMachine'
import { flatten2DArray, shuffleArray, unflatten1DArray } from '../utils'
import CrossTile from './CrossTile'
import HyperTile from './HyperTile'
import SpecialTile from './SpecialTile'
import Tile from './Tile'

class Grid extends Phaser.GameObjects.Container {
    private tileGrid: (Tile | undefined)[][]
    private canMove: boolean
    private firstSelectedTile: Tile | undefined
    private secondSelectedTile: Tile | undefined
    private selectedTiledOutline: Phaser.GameObjects.Image
    private firstHintBox: Phaser.GameObjects.Graphics
    private secondHintBox: Phaser.GameObjects.Graphics
    private explosionPool: ExplosionPool
    private specialTileEffectPool: SpecialTileEffectPool
    private tilesPool: TilesPool
    public stateMachine: StateMachine
    private scoreManager: ScoreManager
    private jellyDestroy: Phaser.Sound.BaseSound
    private jellyDrop: Phaser.Sound.BaseSound
    private wrongMatch: Phaser.Sound.BaseSound
    constructor(scene: Phaser.Scene) {
        super(scene)
        this.scene = scene
        this.tileGrid = []
        this.canMove = true
        this.explosionPool = new ExplosionPool(this.scene)
        this.explosionPool.initializeWithSize(64)
        this.specialTileEffectPool = new SpecialTileEffectPool(this.scene)
        this.specialTileEffectPool.initializeWithSize(4)
        // this.tilesPool = new TilesPool(this.scene)
        // this.tilesPool.initializeWithSize(30)
        const background = this.scene.add.image(0, 0, 'grid')
        background.setOrigin(0)
        background.displayWidth = PADDING * 2 + GAP * (BOARD_WIDTH - 1) + TILE_SIZE * BOARD_WIDTH
        background.width = background.displayWidth
        background.displayHeight = PADDING * 2 + GAP * (BOARD_HEIGHT - 1) + TILE_SIZE * BOARD_HEIGHT
        background.height = background.displayHeight
        this.add(background)
        // for (let y = 0; y < BOARD_HEIGHT; y++) {
        //     this.tileGrid[y] = []
        //     for (let x = 0; x < BOARD_WIDTH; x++) {
        //         const tile = this.addTile(x, y)
        //         this.tileGrid[y][x] = tile
        //         // this.tileGrid[y][x].setInteractive()
        //         // this.tileGrid[y][x].on('pointerdown', this.tileDown, this)
        //         // tileGroup.add(this.tileGrid[y][x])
        //     }
        // }
        this.jellyDestroy = this.scene.sound.add('jellyDestroy')
        this.jellyDrop = this.scene.sound.add('drop')
        this.wrongMatch = this.scene.sound.add('wrongMatch')
        this.stateMachine = new StateMachine('shuffle', {
            shuffle: new ShuffleState(this, scene),
            play: new PlayState(this, scene),
            match: new MatchState(this, scene),
            swap: new SwapState(this, scene),
            fill: new FillState(this, scene),
        })
        // const tileGroup = this.scene.add.group()
        this.selectedTiledOutline = this.scene.add.image(0, 0, 'selectedTile')
        this.selectedTiledOutline.setTint(0xff0000)
        this.selectedTiledOutline.setOrigin(0.5)
        this.selectedTiledOutline.displayWidth = TILE_SIZE + 10
        this.selectedTiledOutline.displayHeight = TILE_SIZE + 10
        this.selectedTiledOutline.width = TILE_SIZE
        this.selectedTiledOutline.height = TILE_SIZE
        this.selectedTiledOutline.setVisible(false)
        this.firstHintBox = this.scene.add.graphics()
        this.firstHintBox.lineStyle(5, 0xff0000)
        this.firstHintBox.strokeRect(0, 0, TILE_SIZE, TILE_SIZE)
        this.firstHintBox.setVisible(false)
        this.secondHintBox = this.scene.add.graphics()
        this.secondHintBox.lineStyle(5, 0xff0000)
        this.secondHintBox.strokeRect(0, 0, TILE_SIZE, TILE_SIZE)
        this.secondHintBox.setVisible(false)
        this.scene.tweens.add({
            targets: this.firstHintBox,
            alpha: 0,
            ease: 'Sine.easeInOut',
            duration: 700,
            repeat: -1,
            yoyo: true,
        })
        this.scene.tweens.add({
            targets: this.secondHintBox,
            alpha: 0,
            ease: 'Sine.easeInOut',
            duration: 700,
            repeat: -1,
            yoyo: true,
        })
        this.add(this.firstHintBox)
        this.add(this.secondHintBox)
        this.bringToTop(this.firstHintBox)
        this.bringToTop(this.secondHintBox)
        this.add(this.selectedTiledOutline)
        this.width = background.displayWidth
        this.height = background.displayHeight
        // console.log(this.width, this.height)
        this.scoreManager = ScoreManager.getInstance(scene)
        this.scene.add.existing(this)
        this.scene.input.on('gameobjectdown', this.tileDown, this)
    }

    public update(time: number, delta: number): void {
        this.stateMachine.update(time, delta)
    }

    public getTileGrid(): (Tile | undefined)[][] {
        return this.tileGrid
    }

    public getFirstSelectedTile(): Tile | undefined {
        return this.firstSelectedTile
    }

    public getSecondSelectedTile(): Tile | undefined {
        return this.secondSelectedTile
    }

    public getFirstHintBox(): Phaser.GameObjects.Graphics {
        return this.firstHintBox
    }

    public getSecondHintBox(): Phaser.GameObjects.Graphics {
        return this.secondHintBox
    }

    public reshuffle(): void {
        let flatGrid = flatten2DArray(this.tileGrid)
        // do {
        flatGrid = shuffleArray(flatGrid)
        console.log('Grid check: ', flatGrid == this.tileGrid)
        this.tileGrid = unflatten1DArray(flatGrid, BOARD_HEIGHT, BOARD_WIDTH)
        console.log('Grid check: ', flatGrid == this.tileGrid)
        // } while (this.getPossibleMove(this.tileGrid).length > 3)
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                if (this.tileGrid[y][x] != undefined) {
                    this.setTilePosition(this.tileGrid[y][x] as Tile, x, y)
                }
            }
        }
    }

    public addTile(x: number, y: number): Tile {
        const randomType = TYPES[Phaser.Math.RND.between(0, TYPES.length - 1)]
        const tile = new Tile({
            scene: this.scene,
            x: PADDING + x * (TILE_SIZE + GAP) + TILE_SIZE / 2,
            y: (y >= 0 ? PADDING : -PADDING) + y * (TILE_SIZE + GAP) + TILE_SIZE / 2,
            texture: randomType,
        })
        tile.state = 'created'
        this.add(tile)
        this.add(tile.emitter)
        // tile.on('pointerdown', this.tileDown, this)
        return tile
    }

    public setTilePosition(tile: Tile, x: number, y: number): void {
        tile.x = PADDING + x * (TILE_SIZE + GAP) + TILE_SIZE / 2
        tile.y = PADDING + y * (TILE_SIZE + GAP) + TILE_SIZE / 2
    }

    public tileDown(pointer: Phaser.Input.Pointer, tile: Tile, event: any) {
        console.log('tile down')
        if (this.canMove) {
            console.log('haha')
            if (!this.firstSelectedTile) {
                this.firstSelectedTile = tile
                this.selectedTiledOutline.setVisible(true)
                this.selectedTiledOutline.x = tile.x
                this.selectedTiledOutline.y = tile.y
                console.log('first tile selected')
                this.scene.tweens.add({
                    targets: this.firstSelectedTile,
                    displayWidth: TILE_SIZE * 1.2,
                    displayHeight: TILE_SIZE * 1.2,
                    ease: 'Sine.easeInOut',
                    duration: 200,
                    yoyo: true,
                    repeat: -1,
                })
            } else {
                this.secondSelectedTile = tile
                console.log('second tile selected')
                const dx = Math.floor(
                    Math.abs(this.firstSelectedTile.x - this.secondSelectedTile.x - GAP) / TILE_SIZE
                )
                const dy = Math.floor(
                    Math.abs(this.firstSelectedTile.y - this.secondSelectedTile.y - GAP) / TILE_SIZE
                )
                // console.log(this.firstSelectedTile)
                // console.log(this.secondSelectedTile)
                console.log(dx, dy)
                if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                    this.canMove = false
                    console.log('can move')
                    this.selectedTiledOutline.setVisible(false)
                    this.firstHintBox.setVisible(false)
                    this.secondHintBox.setVisible(false)
                    // this.swapTiles()
                    if (this.stateMachine.getState() == 'play') {
                        this.scene.tweens.add({
                            targets: this.secondSelectedTile,
                            displayWidth: TILE_SIZE * 1.2,
                            displayHeight: TILE_SIZE * 1.2,
                            ease: 'Sine.easeInOut',
                            duration: 200,
                            yoyo: true,
                            repeat: -1,
                        })
                        this.stateMachine.transition('swap')
                    }
                } else {
                    this.scene.tweens.killTweensOf(this.firstSelectedTile)
                    this.firstSelectedTile.displayWidth = TILE_SIZE
                    this.firstSelectedTile.displayHeight = TILE_SIZE
                    this.firstSelectedTile = this.secondSelectedTile
                    this.secondSelectedTile = undefined
                    this.selectedTiledOutline.x = this.firstSelectedTile.x
                    this.selectedTiledOutline.y = this.firstSelectedTile.y
                    this.scene.tweens.add({
                        targets: this.firstSelectedTile,
                        displayWidth: TILE_SIZE * 1.2,
                        displayHeight: TILE_SIZE * 1.2,
                        ease: 'Sine.easeInOut',
                        duration: 200,
                        yoyo: true,
                        repeat: -1,
                    })
                }
            }
        }
    }

    public swapTiles(): void {
        if (this.firstSelectedTile && this.secondSelectedTile) {
            console.log('swap tiles')
            const firstTilePosition = {
                x: this.firstSelectedTile.x,
                y: this.firstSelectedTile.y,
            }

            const secondTilePosition = {
                x: this.secondSelectedTile.x,
                y: this.secondSelectedTile.y,
            }

            this.tileGrid[(firstTilePosition.y - PADDING - TILE_SIZE / 2) / (TILE_SIZE + GAP)][
                (firstTilePosition.x - PADDING - TILE_SIZE / 2) / (TILE_SIZE + GAP)
            ] = this.secondSelectedTile
            this.tileGrid[(secondTilePosition.y - PADDING - TILE_SIZE / 2) / (TILE_SIZE + GAP)][
                (secondTilePosition.x - PADDING - TILE_SIZE / 2) / (TILE_SIZE + GAP)
            ] = this.firstSelectedTile

            this.scene.add.tween({
                targets: this.firstSelectedTile,
                x: this.secondSelectedTile.x,
                y: this.secondSelectedTile.y,
                ease: 'Cubic.easeInOut',
                duration: 400,
                repeat: 0,
                yoyo: false,
            })

            this.scene.add.tween({
                targets: this.secondSelectedTile,
                x: this.firstSelectedTile.x,
                y: this.firstSelectedTile.y,
                ease: 'Cubic.easeInOut',
                duration: 400,
                repeat: 0,
                yoyo: false,
                onComplete: () => {
                    if (this.stateMachine.getState() == 'swap') {
                        this.stateMachine.transition('match')
                    }
                },
            })
            this.canMove = true
            console.log(
                (firstTilePosition.y - PADDING - TILE_SIZE / 2) / (TILE_SIZE + GAP),
                (firstTilePosition.x - PADDING - TILE_SIZE / 2) / (TILE_SIZE + GAP)
            )
            this.firstSelectedTile =
                this.tileGrid[(firstTilePosition.y - PADDING - TILE_SIZE / 2) / (TILE_SIZE + GAP)][
                    (firstTilePosition.x - PADDING - TILE_SIZE / 2) / (TILE_SIZE + GAP)
                ]
            this.secondSelectedTile =
                this.tileGrid[(secondTilePosition.y - PADDING - TILE_SIZE / 2) / (TILE_SIZE + GAP)][
                    (secondTilePosition.x - PADDING - TILE_SIZE / 2) / (TILE_SIZE + GAP)
                ]
        }
    }

    public checkMatches(): boolean {
        //Call the getMatches function to check for spots where there is
        //a run of three or more tiles in a row
        const matches = this.getMatches(this.tileGrid)

        //If there are matches, remove them
        if (matches.length > 0) {
            this.removeMatchedGroup(matches)
            // Move the tiles currently on the board into their new positions
            // this.resetTile()
            //Fill the board with new tiles wherever there is an empty spot
            // this.fillTile()
            this.tileUp()
            // setTimeout(() => {
            //     this.checkMatches()
            // }, 1000)
            return true
        } else {
            // No match so just swap the tiles back to their original position and reset
            if (this.firstSelectedTile && this.secondSelectedTile) this.wrongMatch.play()
            this.swapTiles()
            this.tileUp()
            this.canMove = true
            this.scoreManager.setMultiplier(1)
            return false
        }
    }

    public resetTile(): void {
        // Loop through each column starting from the left
        for (let x = 0; x < BOARD_WIDTH; x++) {
            let space = false
            let spaceY = -1
            let y = BOARD_HEIGHT - 1
            let columnAmount = 0
            while (y >= 0) {
                const tile = this.tileGrid[y][x]
                if (space) {
                    if (tile) {
                        this.tileGrid[spaceY][x] = tile
                        tile.state = 'moved'
                        this.scene.add.tween({
                            targets: tile,
                            y: PADDING + spaceY * (TILE_SIZE + GAP) + TILE_SIZE / 2,
                            ease: 'Quad.easeIn',
                            duration: 400,
                            delay: columnAmount * 50,
                            repeat: 0,
                            yoyo: false,
                            onComplete: () => {
                                tile.state = 'spawned'
                                this.jellyDrop.play()
                            },
                            onStart: () => {
                                tile.state = 'moving'
                            },
                        })
                        columnAmount++
                        this.tileGrid[y][x] = undefined
                        space = false
                        y = spaceY
                        spaceY = -1
                    }
                } else if (!tile) {
                    space = true
                    if (spaceY == -1) {
                        spaceY = y
                    }
                }
                y--
            }
        }
    }

    public fillTile(): void {
        //Check for blank spaces in the grid and add new tiles at that position
        const newTiles: Tile[][] = []
        const rowAmount = []
        for (let x = 0; x < BOARD_WIDTH; x++) {
            rowAmount[x] = 1
        }
        for (let y = this.tileGrid.length - 1; y >= 0; y--) {
            for (let x = 0; x < this.tileGrid[y].length; x++) {
                if (this.tileGrid[y][x] === undefined) {
                    //Found a blank spot so lets add animate a tile there
                    if (!newTiles[x]) {
                        newTiles[x] = []
                    }
                    const tile = this.addTile(x, -newTiles[x].length - 1)
                    this.add(tile)
                    this.add(tile.emitter)
                    this.scene.add.tween({
                        targets: tile,
                        y: PADDING + y * (TILE_SIZE + GAP) + TILE_SIZE / 2,
                        ease: 'Quad.easeIn',
                        duration: 400,
                        repeat: 0,
                        yoyo: false,
                        delay: rowAmount[x] * 50,
                        onComplete: () => {
                            tile.state = 'spawned'
                            this.jellyDrop.play()
                        },
                    })
                    rowAmount[x]++
                    newTiles[x].push(tile)
                    //And also update our "theoretical" grid
                    this.tileGrid[y][x] = tile
                }
            }
        }
    }

    private tileUp(): void {
        // Reset active tiles
        this.firstSelectedTile = undefined
        this.secondSelectedTile = undefined
    }

    private removeMatchedGroup(
        matches: { type: string; x: number; y: number; pattern: number[][]; priority: number }[]
    ) {
        for (let i = 0; i < matches.length; i++) {
            const match = matches[i]
            const tile = this.tileGrid[match.y][match.x]
            if (tile) {
                const score = this.scoreManager.matchScore(match.type, match.pattern.length)
                let multiplier = this.scoreManager.getMultiplier() + 0.2
                if (multiplier > 3) {
                    multiplier = 3
                }
                this.scoreManager.setMultiplier(multiplier)
                const scoreText = this.scene.add.text(tile.x, tile.y, `${score}`, {
                    fontSize: '48px',
                    color: '#ff0',
                    fontStyle: 'bold',
                })
                scoreText.setOrigin(0.5)
                this.add(scoreText)
                this.scene.tweens.add({
                    targets: scoreText,
                    y: tile.y - 50,
                    alpha: 0,
                    ease: 'Quad.easeIn',
                    duration: 2000,
                    repeat: 0,
                    yoyo: false,
                    onComplete: () => {
                        scoreText.destroy()
                    },
                })
            }
            if (match.type === 'T') {
                const mergeTile = this.tileGrid[match.y][match.x]
                if (mergeTile) {
                    const newTile = new CrossTile({
                        scene: this.scene,
                        x: mergeTile ? mergeTile.x : 0,
                        y: mergeTile ? mergeTile.y : 0,
                        texture: mergeTile
                            ? mergeTile.texture.key.slice(0, 5) + '_stripes_h'
                            : 'item1_stripes_h',
                    })
                    this.add(newTile)
                    newTile.state = 'spawned'
                    for (let j = 0; j < match.pattern.length; j++) {
                        const dx = match.pattern[j][0]
                        const dy = match.pattern[j][1]
                        const tile = this.tileGrid[match.y + dy][match.x + dx]
                        if (tile) {
                            this.scene.tweens.add({
                                targets: tile,
                                x: newTile.x,
                                y: newTile.y,
                                ease: 'Sine.easeInOut',
                                duration: 200,
                                yoyo: false,
                                repeat: 0,
                                onComplete: () => {
                                    // tile.emitter.setPosition(tile.x, tile.y)
                                    // this.destroyTile(tile)
                                    tile.emitter.explode(20)
                                    this.scene.time.delayedCall(1000, () => {
                                        this.explosionPool.despawn(tile.emitter)
                                    })
                                    this.specialTileEffectPool.despawn(tile.specialEmitter)
                                    this.jellyDestroy.play()
                                    tile.destroy()
                                },
                            })
                            this.tileGrid[match.y + dy][match.x + dx] = undefined
                        }
                        this.tileGrid[match.y][match.x] = newTile
                    }
                }
            } else if (match.type == '3') {
                for (let j = 0; j < match.pattern.length; j++) {
                    const dx = match.pattern[j][0]
                    const dy = match.pattern[j][1]
                    const tile = this.tileGrid[match.y + dy][match.x + dx]
                    if (tile) {
                        this.destroyTile(tile)
                    }
                }
            } else if (match.type === '4' || match.type === '5' || match.type === '6') {
                const mergeTile = this.tileGrid[match.y][match.x]
                if (mergeTile) {
                    let newTile: Tile
                    if (match.type === '4') {
                        newTile = new SpecialTile({
                            scene: this.scene,
                            x: mergeTile ? mergeTile.x : 0,
                            y: mergeTile ? mergeTile.y : 0,
                            texture: mergeTile
                                ? mergeTile.texture.key.slice(0, 5) + '_extra'
                                : 'item1_extra',
                        })
                    } else {
                        newTile = new HyperTile({
                            scene: this.scene,
                            x: mergeTile ? mergeTile.x : 0,
                            y: mergeTile ? mergeTile.y: 0,
                            texture: ''
                        })
                    }
                    this.add(newTile)
                    newTile.state = 'spawned'
                    for (let j = 0; j < match.pattern.length; j++) {
                        const dx = match.pattern[j][0]
                        const dy = match.pattern[j][1]
                        const tile = this.tileGrid[match.y + dy][match.x + dx]

                        if (tile) {
                            this.scene.tweens.add({
                                targets: tile,
                                x: newTile.x,
                                y: newTile.y,
                                ease: 'Sine.easeInOut',
                                duration: 200,
                                yoyo: false,
                                repeat: 0,
                                onComplete: () => {
                                    // tile.emitter.setPosition(tile.x, tile.y)
                                    // this.destroyTile(tile)
                                    tile.emitter.explode(20)
                                    this.scene.time.delayedCall(1000, () => {
                                        this.explosionPool.despawn(tile.emitter)
                                    })
                                    this.specialTileEffectPool.despawn(tile.specialEmitter)
                                    tile.destroy()
                                    this.jellyDestroy.play()
                                },
                            })
                            this.tileGrid[match.y + dy][match.x + dx] = undefined
                            // this.destroyTile(tile)
                        }
                    }
                    this.tileGrid[match.y][match.x] = newTile
                }
            }
            // tile?.destroy()
        }
        return
    }

    private destroyTile(tile: Tile): void {
        const tilePos = this.getTilePos(this.tileGrid, tile)
        if (tilePos.x !== -1 && tilePos.y !== -1) {
            // tile?.emitter.setPosition(tile.x, tile.y)
            // tile?.emitter.explode(20)
            this.scene.time.delayedCall(1000, () => {
                this.explosionPool.despawn(tile.emitter)
            })
            this.specialTileEffectPool.despawn(tile.specialEmitter)
            const tiles = tile.getExplodedTile(this)
            this.tileGrid[tilePos.y][tilePos.x] = undefined
            tiles.forEach((currentTile) => {
                if (currentTile && currentTile !== tile) {
                    this.destroyTile(currentTile)
                }
            })
            tile.explode()
            this.jellyDestroy.play()
            // tile?.destroy()
        }
    }

    public getTilePos(tileGrid: (Tile | undefined)[][], tile: Tile): { x: number; y: number } {
        const pos = { x: -1, y: -1 }

        //Find the position of a specific tile in the grid
        for (let y = 0; y < tileGrid.length; y++) {
            for (let x = 0; x < tileGrid[y].length; x++) {
                //There is a match at this position so return the grid coords
                if (tile === tileGrid[y][x]) {
                    pos.x = x
                    pos.y = y
                    break
                }
            }
        }

        return pos
    }

    public getPossibleMove(
        tileGrid: (Tile | undefined)[][]
    ): { x1: number; x2: number; y1: number; y2: number }[] {
        const possibleMoves: { x1: number; x2: number; y1: number; y2: number }[] = []
        for (let y = 0; y < tileGrid.length; y++) {
            for (let x = 0; x < tileGrid[y].length; x++) {
                if (x < tileGrid[y].length - 1) {
                    let tempTile = tileGrid[y][x]
                    tileGrid[y][x] = tileGrid[y][x + 1]
                    tileGrid[y][x + 1] = tempTile
                    // console.log(x, y)
                    const matches = this.getMatches(tileGrid)
                    if (matches.length > 0) {
                        possibleMoves.push({ x1: x, x2: x + 1, y1: y, y2: y })
                    }
                    tempTile = tileGrid[y][x]
                    tileGrid[y][x] = tileGrid[y][x + 1]
                    tileGrid[y][x + 1] = tempTile
                }
                if (y < tileGrid.length - 1) {
                    let tempTile = tileGrid[y][x]
                    tileGrid[y][x] = tileGrid[y + 1][x]
                    tileGrid[y + 1][x] = tempTile
                    // console.log(x, y)
                    const matches = this.getMatches(tileGrid)
                    if (matches.length > 0) {
                        possibleMoves.push({ x1: x, x2: x, y1: y, y2: y + 1 })
                    }
                    tempTile = tileGrid[y][x]
                    tileGrid[y][x] = tileGrid[y + 1][x]
                    tileGrid[y + 1][x] = tempTile
                }
            }
        }
        return possibleMoves
    }

    public getMatches(
        tileGrid: (Tile | undefined)[][]
    ): { type: string; x: number; y: number; pattern: number[][]; priority: number }[] {
        const matches: (Tile | undefined)[][] = []
        let groups: (Tile | undefined)[] = []
        const matchGroups: {
            type: string
            x: number
            y: number
            pattern: number[][]
            priority: number
        }[] = []
        let lastMatchPosition = 0
        // Check for horizontal matches
        for (let y = 0; y < tileGrid.length; y++) {
            const tempArray = tileGrid[y]
            groups = []
            for (let x = 0; x < tempArray.length; x++) {
                let tShape = false
                T_SHAPE_PATTERN.forEach((pattern) => {
                    if (this.checkPattern(x, y, tileGrid, pattern)) {
                        matchGroups.push({ type: 'T', x, y, pattern, priority: 1 })
                        tShape = true
                    }
                })
                if (x < tempArray.length - 2 && !tShape) {
                    if (tileGrid[y][x] && tileGrid[y][x + 1] && tileGrid[y][x + 2]) {
                        const key1 = tileGrid[y][x]?.texture.key.slice(0, 5)
                        const key2 = tileGrid[y][x + 1]?.texture.key.slice(0, 5)
                        const key3 = tileGrid[y][x + 2]?.texture.key.slice(0, 5)
                        if (key1 === key2 && key2 === key3) {
                            if (groups.length > 0) {
                                if (groups.indexOf(tileGrid[y][x]) == -1) {
                                    matches.push(groups)
                                    const pattern = []
                                    let movedTile: Tile | undefined
                                    let index = 0
                                    const index1 = groups.indexOf(this.firstSelectedTile)
                                    const index2 = groups.indexOf(this.secondSelectedTile)
                                    if (index1 !== -1 && this.firstSelectedTile) {
                                        movedTile = this.firstSelectedTile
                                        index = index1
                                    } else if (index2 !== -1 && this.secondSelectedTile) {
                                        movedTile = this.secondSelectedTile
                                        index = index2
                                    }
                                    // for (let i = index - 1; i >= 0; i--) {
                                    //     pattern.push([i - index, 0])
                                    // }
                                    // for (let i = index; i < groups.length; i++) {
                                    //     pattern.push([i - index, 0])
                                    // }
                                    for (let i = 0; i < groups.length; i++) {
                                        pattern.push([i - index, 0])
                                    }
                                    if (movedTile) {
                                        const pos = this.getTilePos(this.tileGrid, movedTile)
                                        matchGroups.push({
                                            type: `${groups.length}`,
                                            x: pos.x,
                                            y: pos.y,
                                            pattern,
                                            priority: 2,
                                        })
                                    } else {
                                        matchGroups.push({
                                            type: `${groups.length}`,
                                            x: lastMatchPosition + 1 - groups.length,
                                            y: y,
                                            pattern,
                                            priority: 2,
                                        })
                                    }
                                    groups = []
                                }
                            }

                            if (groups.indexOf(tileGrid[y][x]) == -1) {
                                groups.push(tileGrid[y][x])
                            }

                            if (groups.indexOf(tileGrid[y][x + 1]) == -1) {
                                groups.push(tileGrid[y][x + 1])
                            }

                            if (groups.indexOf(tileGrid[y][x + 2]) == -1) {
                                groups.push(tileGrid[y][x + 2])
                            }

                            lastMatchPosition = x + 2
                        }
                    }
                }
            }

            if (groups.length > 0) {
                matches.push(groups)
                let movedTile: Tile | undefined
                let index = 0
                const pattern = []
                const index1 = groups.indexOf(this.firstSelectedTile)
                const index2 = groups.indexOf(this.secondSelectedTile)
                if (index1 !== -1 && this.firstSelectedTile) {
                    movedTile = this.firstSelectedTile
                    index = index1
                } else if (index2 !== -1 && this.secondSelectedTile) {
                    movedTile = this.secondSelectedTile
                    index = index2
                }
                for (let i = 0; i < groups.length; i++) {
                    pattern.push([i - index, 0])
                }
                if (movedTile) {
                    const pos = this.getTilePos(this.tileGrid, movedTile)
                    matchGroups.push({
                        type: `${groups.length}`,
                        x: pos.x,
                        y: pos.y,
                        pattern,
                        priority: 2,
                    })
                } else {
                    matchGroups.push({
                        type: `${groups.length}`,
                        x: lastMatchPosition + 1 - groups.length,
                        y: y,
                        pattern,
                        priority: 2,
                    })
                }
            }
        }

        lastMatchPosition = 0

        //Check for vertical matches
        for (let j = 0; j < tileGrid.length; j++) {
            const tempArr = tileGrid[j]
            groups = []
            for (let i = 0; i < tempArr.length; i++) {
                let tShape = false
                T_SHAPE_PATTERN.forEach((pattern) => {
                    if (this.checkPattern(j, i, tileGrid, pattern)) {
                        tShape = true
                    }
                })
                if (i < tempArr.length - 2 && !tShape)
                    if (tileGrid[i][j] && tileGrid[i + 1][j] && tileGrid[i + 2][j]) {
                        const key1 = tileGrid[i][j]?.texture.key.slice(0, 5)
                        const key2 = tileGrid[i + 1][j]?.texture.key.slice(0, 5)
                        const key3 = tileGrid[i + 2][j]?.texture.key.slice(0, 5)
                        if (key1 === key2 && key2 === key3) {
                            if (groups.length > 0) {
                                if (groups.indexOf(tileGrid[i][j]) == -1) {
                                    matches.push(groups)
                                    const pattern = []
                                    let movedTile: Tile | undefined
                                    const index1 = groups.indexOf(this.firstSelectedTile)
                                    const index2 = groups.indexOf(this.secondSelectedTile)
                                    let index = 0
                                    if (index1 !== -1 && this.firstSelectedTile) {
                                        movedTile = this.firstSelectedTile
                                        index = index1
                                    } else if (index2 !== -1 && this.secondSelectedTile) {
                                        movedTile = this.secondSelectedTile
                                        index = index2
                                    }
                                    // for (let i = index - 1; i >= 0; i--) {
                                    //     pattern.push([0, i - index])
                                    // }
                                    // for (let i = index; i < groups.length; i++) {
                                    //     pattern.push([0, i])
                                    // }
                                    for (let i = 0; i < groups.length; i++) {
                                        pattern.push([0, i - index])
                                    }
                                    if (movedTile) {
                                        const pos = this.getTilePos(this.tileGrid, movedTile)
                                        matchGroups.push({
                                            type: `${groups.length}`,
                                            x: pos.x,
                                            y: pos.y,
                                            pattern,
                                            priority: 2,
                                        })
                                    } else {
                                        matchGroups.push({
                                            type: `${groups.length}`,
                                            x: j,
                                            y: lastMatchPosition + 1 - groups.length,
                                            pattern,
                                            priority: 2,
                                        })
                                    }
                                    groups = []
                                }
                            }

                            if (groups.indexOf(tileGrid[i][j]) == -1) {
                                groups.push(tileGrid[i][j])
                            }
                            if (groups.indexOf(tileGrid[i + 1][j]) == -1) {
                                groups.push(tileGrid[i + 1][j])
                            }
                            if (groups.indexOf(tileGrid[i + 2][j]) == -1) {
                                groups.push(tileGrid[i + 2][j])
                            }

                            lastMatchPosition = i + 2
                        }
                    }
            }
            if (groups.length > 0) {
                matches.push(groups)
                const pattern = []
                let movedTile: Tile | undefined
                const index1 = groups.indexOf(this.firstSelectedTile)
                const index2 = groups.indexOf(this.secondSelectedTile)
                let index = 0
                if (index1 !== -1 && this.firstSelectedTile) {
                    movedTile = this.firstSelectedTile
                    index = index1
                } else if (index2 !== -1 && this.secondSelectedTile) {
                    movedTile = this.secondSelectedTile
                    index = index2
                }
                for (let i = 0; i < groups.length; i++) {
                    pattern.push([0, i - index])
                }
                if (movedTile) {
                    const pos = this.getTilePos(this.tileGrid, movedTile)
                    matchGroups.push({
                        type: `${groups.length}`,
                        x: pos.x,
                        y: pos.y,
                        pattern,
                        priority: 2,
                    })
                } else {
                    matchGroups.push({
                        type: `${groups.length}`,
                        x: j,
                        y: lastMatchPosition + 1 - groups.length,
                        pattern,
                        priority: 2,
                    })
                }
            }
        }
        // if (matchGroups.length > 0) {
        //     console.log('T shape: ', matchGroups)
        // }

        matchGroups.sort((a, b) => a.priority - b.priority)

        return matchGroups
    }

    private checkPattern(
        x: number,
        y: number,
        tileGrid: (Tile | undefined)[][],
        pattern: number[][]
    ): boolean {
        const tile = tileGrid[y][x]
        if (tile) {
            return pattern.every(([dx, dy]) => {
                const newX = x + dx
                const newY = y + dy
                return (
                    newX >= 0 &&
                    newX < BOARD_WIDTH &&
                    newY >= 0 &&
                    newY < BOARD_HEIGHT &&
                    tileGrid[newY][newX]?.texture.key === tile.texture.key
                )
            })
        }
        return false
    }
}

export default Grid
