import { BOARD_HEIGHT, BOARD_WIDTH, GAP, PADDING, TILE_SIZE, TYPES } from '../constants'
import { ExplosionPool, SpecialTileEffectPool } from '../object-pools'
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
    constructor(scene: Phaser.Scene) {
        super(scene)
        this.scene = scene
        this.tileGrid = []
        this.canMove = true
        this.explosionPool = new ExplosionPool(this.scene)
        this.explosionPool.initializeWithSize(64)
        this.specialTileEffectPool = new SpecialTileEffectPool(this.scene)
        this.specialTileEffectPool.initializeWithSize(4)
        const background = this.scene.add.image(0, 0, 'grid')
        background.setOrigin(0)
        background.displayWidth = PADDING * 2 + GAP * (BOARD_WIDTH - 1) + TILE_SIZE * BOARD_WIDTH
        background.width = background.displayWidth
        background.displayHeight = PADDING * 2 + GAP * (BOARD_HEIGHT - 1) + TILE_SIZE * BOARD_HEIGHT
        background.height = background.displayHeight
        this.add(background)
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            this.tileGrid[y] = []
            for (let x = 0; x < BOARD_WIDTH; x++) {
                const tile = this.addTile(x, y)
                this.tileGrid[y][x] = tile
                this.add(tile)
                this.add(tile.emitter)
            }
        }
        this.selectedTiledOutline = this.scene.add.image(0, 0, 'selectedTile')
        this.selectedTiledOutline.setOrigin(0.5)
        this.selectedTiledOutline.displayWidth = TILE_SIZE
        this.selectedTiledOutline.displayHeight = TILE_SIZE
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
        this.scene.add.existing(this)
        this.scene.input.on('gameobjectdown', this.tileDown, this)
        this.checkMatches()
    }

    private addTile(x: number, y: number): Tile {
        const randomType = TYPES[Phaser.Math.RND.between(0, TYPES.length - 1)]
        return new Tile({
            scene: this.scene,
            x: PADDING + x * (TILE_SIZE + GAP) + TILE_SIZE / 2,
            y: (y >= 0 ? PADDING : -PADDING) + y * (TILE_SIZE + GAP) + TILE_SIZE / 2,
            texture: randomType,
        })
    }

    private tileDown(pointer: Phaser.Input.Pointer, tile: Tile, event: any) {
        console.log('tile down')
        if (this.canMove) {
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
                    repeat: 0,
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
                console.log(dx, dy)
                if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                    this.canMove = false
                    console.log('can move')
                    this.selectedTiledOutline.setVisible(false)
                    this.firstHintBox.setVisible(false)
                    this.secondHintBox.setVisible(false)
                    this.swapTiles()
                } else {
                    this.firstSelectedTile = this.secondSelectedTile
                    this.selectedTiledOutline.x = this.firstSelectedTile.x
                    this.selectedTiledOutline.y = this.firstSelectedTile.y
                    this.scene.tweens.add({
                        targets: this.firstSelectedTile,
                        displayWidth: TILE_SIZE * 1.2,
                        displayHeight: TILE_SIZE * 1.2,
                        ease: 'Sine.easeInOut',
                        duration: 200,
                        yoyo: true,
                        repeat: 0,
                    })
                }
            }
        }
    }

    private swapTiles(): void {
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
                    this.checkMatches()
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

    private checkMatches(): void {
        //Call the getMatches function to check for spots where there is
        //a run of three or more tiles in a row
        const matches = this.getMatches(this.tileGrid)

        //If there are matches, remove them
        if (matches.length > 0) {
            //Remove the tiles
            console.log('matches: ', matches)
            this.removeTileGroup(matches)
            // Move the tiles currently on the board into their new positions
            this.resetTile()
            //Fill the board with new tiles wherever there is an empty spot
            this.fillTile()
            this.tileUp()
            setTimeout(() => {
                this.checkMatches()
            }, 1000)
        } else {
            // No match so just swap the tiles back to their original position and reset
            this.swapTiles()
            this.tileUp()
            this.canMove = true
            console.log('Possible move: ', this.getPossibleMove(this.tileGrid))
            const possibleMoves = this.getPossibleMove(this.tileGrid)
            if (possibleMoves.length > 0) {
                const randomMove = this.getPossibleMove(this.tileGrid)[
                    Phaser.Math.RND.between(0, this.getPossibleMove(this.tileGrid).length - 1)
                ]
                console.log(randomMove)
                this.firstHintBox.x = PADDING + randomMove.x1 * (TILE_SIZE + GAP)
                this.firstHintBox.y = PADDING + randomMove.y1 * (TILE_SIZE + GAP)
                this.firstHintBox.setVisible(true)
                this.secondHintBox.x = PADDING + randomMove.x2 * (TILE_SIZE + GAP)
                this.secondHintBox.y = PADDING + randomMove.y2 * (TILE_SIZE + GAP)
                this.secondHintBox.setVisible(true)
            } else {
                console.log('No possible move')
            }
        }
    }

    private resetTile(): void {
        // Loop through each column starting from the left
        for (let x = 0; x < BOARD_WIDTH; x++) {
            let space = false
            let spaceY = -1
            let y = BOARD_HEIGHT - 1
            while (y >= 0) {
                const tile = this.tileGrid[y][x]
                if (space) {
                    if (tile) {
                        this.tileGrid[spaceY][x] = tile
                        this.scene.add.tween({
                            targets: tile,
                            y: PADDING + spaceY * (TILE_SIZE + GAP) + TILE_SIZE / 2,
                            ease: 'Cubic.easeIn',
                            duration: 400,
                            repeat: 0,
                            yoyo: false,
                        })
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
        // for (let y = this.tileGrid.length - 1; y > 0; y--) {
        //     // Loop through each tile in column from bottom to top
        //     for (let x = this.tileGrid[y].length - 1; x > 0; x--) {
        //         // If this space is blank, but the one above it is not, move the one above down
        //         if (this.tileGrid[y][x] === undefined && this.tileGrid[y - 1][x] !== undefined) {
        //             // Move the tile above down one
        //             const tempTile = this.tileGrid[y - 1][x]
        //             this.tileGrid[y][x] = tempTile
        //             this.tileGrid[y - 1][x] = undefined

        //             this.scene.add.tween({
        //                 targets: tempTile,
        //                 y: PADDING + y * (TILE_SIZE + GAP),
        //                 ease: 'Linear',
        //                 duration: 400,
        //                 repeat: 0,
        //                 yoyo: false,
        //             })

        //             //The positions have changed so start this process again from the bottom
        //             //NOTE: This is not set to me.tileGrid[i].length - 1 because it will immediately be decremented as
        //             //we are at the end of the loop.
        //             x = this.tileGrid[y].length
        //         }
        //     }
        // }
    }

    private fillTile(): void {
        //Check for blank spaces in the grid and add new tiles at that position
        const newTiles: Tile[][] = []
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
                        ease: 'Cubic.easeIn',
                        duration: 400,
                        repeat: 0,
                        yoyo: false,
                    })
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

    private removeTileGroup(matches: any): void {
        // Loop through all the matches and remove the associated tiles
        // if (matches.length == 4) {
        //     for (let i = 1; i < matches.length; i++) {
        //         const tempArr = matches[i]
        //         for (let j = 0; j < tempArr.length; j++) {
        //             const tile = tempArr[j]
        //             //Find where this tile lives in the theoretical grid
        //             const tilePos = this.getTilePos(this.tileGrid, tile)
        //             console.log(tilePos)

        //             // Remove the tile from the theoretical grid
        //             if (tilePos.x !== -1 && tilePos.y !== -1) {
        //                 this.scene.tweens.add({
        //                     targets: tile,
        //                     x: matches[0].x,
        //                     y: matches[0].y,
        //                     ease: 'Sine.easeInOut',
        //                     duration: 200,
        //                     yoyo: false,
        //                     repeat: 0,
        //                     onComplete: () => {
        //                         tile.emitter.setPosition(tile.x, tile.y)
        //                         tile.emitter.explode(20)
        //                         tile.destroy()
        //                     },
        //                 })
        //                 // tile.emitter.setPosition(tile.x, tile.y)
        //                 // tile.emitter.explode(20)
        //                 // tile.destroy()
        //                 this.tileGrid[tilePos.y][tilePos.x] = undefined
        //             }
        //         }
        //     }
        for (let i = 0; i < matches.length; i++) {
            const tempArr = matches[i]
            if (tempArr.length >= 4) {
                const upgradetilePos = this.getTilePos(this.tileGrid, tempArr[0])
                const newTile = new SpecialTile({
                    scene: this.scene,
                    x: tempArr[0].x,
                    y: tempArr[0].y,
                    texture: tempArr[0].texture.key,
                })
                this.tileGrid[upgradetilePos.y][upgradetilePos.x] = newTile
                this.add(newTile)
                this.add(newTile.specialEmitter)
                tempArr[0].destroy()
                for (let j = 1; j < tempArr.length; j++) {
                    const tile = tempArr[j]
                    //Find where this tile lives in the theoretical grid
                    const tilePos = this.getTilePos(this.tileGrid, tile)
                    console.log(tilePos)

                    // Remove the tile from the theoretical grid
                    if (tilePos.x !== -1 && tilePos.y !== -1) {
                        this.scene.tweens.add({
                            targets: tile,
                            x: tempArr[0].x,
                            y: tempArr[0].y,
                            ease: 'Sine.easeInOut',
                            duration: 200,
                            yoyo: false,
                            repeat: 0,
                            onComplete: () => {
                                // tile.emitter.setPosition(tile.x, tile.y)
                                tile.emitter.explode(20)
                                this.scene.time.delayedCall(1000, () => {
                                    this.explosionPool.despawn(tile.emitter)
                                })
                                tile.destroy()
                            },
                        })
                        // tile.emitter.setPosition(tile.x, tile.y)
                        // tile.emitter.explode(20)
                        // tile.destroy()
                        this.tileGrid[tilePos.y][tilePos.x] = undefined
                    }
                }
            } else {
                for (let j = 0; j < tempArr.length; j++) {
                    const tile = tempArr[j]
                    //Find where this tile lives in the theoretical grid
                    const tilePos = this.getTilePos(this.tileGrid, tile)
                    console.log(tilePos)

                    // Remove the tile from the theoretical grid
                    if (tilePos.x !== -1 && tilePos.y !== -1) {
                        if (tile instanceof SpecialTile) {
                            this.specialTileEffectPool.despawn(tile.specialEmitter)
                            const tiles = this.getExplodedTiles(tile)
                            tiles.forEach((tile) => {
                                if (tile) {
                                    const tilePos = this.getTilePos(this.tileGrid, tile)
                                    // tile?.emitter.setPosition(tile.x, tile.y)
                                    tile?.emitter.explode(20)
                                    this.scene.time.delayedCall(1000, () => {
                                        this.explosionPool.despawn(tile.emitter)
                                    })
                                    tile?.destroy()
                                    this.tileGrid[tilePos.y][tilePos.x] = undefined
                                }
                            })
                        } else {
                            // tile.emitter.setPosition(tile.x, tile.y)
                            tile.emitter.explode(20)
                            this.scene.time.delayedCall(1000, () => {
                                this.explosionPool.despawn(tile.emitter)
                            })
                            tile.destroy()
                            this.tileGrid[tilePos.y][tilePos.x] = undefined
                        }
                    }
                }
            }
        }
        console.log(this.tileGrid)
    }

    private getExplodedTiles(tile: Tile): (Tile | undefined)[] {
        const tilePos = this.getTilePos(this.tileGrid, tile)
        const tiles = []
        if (tilePos.x !== -1 && tilePos.y !== -1) {
            for (let i = tilePos.y - 1; i <= tilePos.y + 1; i++) {
                for (let j = tilePos.x - 1; j <= tilePos.x + 1; j++) {
                    if (i >= 0 && i < BOARD_HEIGHT && j >= 0 && j < BOARD_WIDTH) {
                        tiles.push(this.tileGrid[i][j])
                    }
                }
            }
        }

        return tiles
    }

    private getTilePos(tileGrid: (Tile | undefined)[][], tile: Tile): any {
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

    private getPossibleMove(
        tileGrid: (Tile | undefined)[][]
    ): { x1: number; x2: number; y1: number; y2: number }[] {
        const possibleMoves: { x1: number; x2: number; y1: number; y2: number }[] = []
        for (let y = 0; y < tileGrid.length; y++) {
            for (let x = 0; x < tileGrid[y].length; x++) {
                if (x < tileGrid[y].length - 1) {
                    let tempTile = tileGrid[y][x]
                    tileGrid[y][x] = tileGrid[y][x + 1]
                    tileGrid[y][x + 1] = tempTile
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

    private getMatches(tileGrid: (Tile | undefined)[][]): (Tile | undefined)[][] {
        const matches: (Tile | undefined)[][] = []
        let groups: (Tile | undefined)[] = []

        // Check for horizontal matches
        for (let y = 0; y < tileGrid.length; y++) {
            const tempArray = tileGrid[y]
            groups = []
            for (let x = 0; x < tempArray.length; x++) {
                if (x < tempArray.length - 2) {
                    if (tileGrid[y][x] && tileGrid[y][x + 1] && tileGrid[y][x + 2]) {
                        if (
                            tileGrid[y][x]?.texture.key === tileGrid[y][x + 1]?.texture.key &&
                            tileGrid[y][x + 1]?.texture.key === tileGrid[y][x + 2]?.texture.key
                        ) {
                            if (groups.length > 0) {
                                if (groups.indexOf(tileGrid[y][x]) == -1) {
                                    matches.push(groups)
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
                        }
                    }
                }
            }

            if (groups.length > 0) {
                matches.push(groups)
            }
        }

        //Check for vertical matches
        for (let j = 0; j < tileGrid.length; j++) {
            const tempArr = tileGrid[j]
            groups = []
            for (let i = 0; i < tempArr.length; i++) {
                if (i < tempArr.length - 2)
                    if (tileGrid[i][j] && tileGrid[i + 1][j] && tileGrid[i + 2][j]) {
                        if (
                            tileGrid[i][j]?.texture.key === tileGrid[i + 1][j]?.texture.key &&
                            tileGrid[i + 1][j]?.texture.key === tileGrid[i + 2][j]?.texture.key
                        ) {
                            if (groups.length > 0) {
                                if (groups.indexOf(tileGrid[i][j]) == -1) {
                                    matches.push(groups)
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
                        }
                    }
            }
            if (groups.length > 0) matches.push(groups)
        }

        return matches
    }
}

export default Grid
