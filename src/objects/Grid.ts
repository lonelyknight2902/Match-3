import { BOARD_HEIGHT, BOARD_WIDTH, GAP, PADDING, TILE_SIZE, TYPES } from '../constants'
import Tile from './Tile'

class Grid extends Phaser.GameObjects.Container {
    private tileGrid: (Tile | undefined)[][]
    private canMove: boolean
    private firstSelectedTile: Tile | undefined
    private secondSelectedTile: Tile | undefined
    constructor(scene: Phaser.Scene) {
        super(scene)
        this.scene = scene
        this.tileGrid = []
        this.canMove = true
        const background = this.scene.add.image(0, 0, 'grid')
        background.setOrigin(0)
        background.displayWidth = PADDING * 2 + GAP * (BOARD_WIDTH - 1) + TILE_SIZE * BOARD_WIDTH
        background.displayHeight = PADDING * 2 + GAP * (BOARD_HEIGHT - 1) + TILE_SIZE * BOARD_HEIGHT
        this.add(background)
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            this.tileGrid[y] = []
            for (let x = 0; x < BOARD_WIDTH; x++) {
                const tile = this.addTile(x, y)
                this.tileGrid[y][x] = tile
                this.add(tile)
            }
        }
        this.scene.add.existing(this)
        this.scene.input.on('gameobjectdown', this.tileDown, this)
        this.checkMatches()
    }

    private addTile(x: number, y: number): Tile {
        const randomType = TYPES[Phaser.Math.RND.between(0, TYPES.length - 1)]
        return new Tile({
            scene: this.scene,
            x: PADDING + x * (TILE_SIZE + GAP),
            y: (y >= 0 ? PADDING : -PADDING) + y * (TILE_SIZE + GAP),
            texture: randomType,
        })
    }

    private tileDown(pointer: Phaser.Input.Pointer, tile: Tile, event: any) {
        console.log('tile down')
        if (this.canMove) {
            if (!this.firstSelectedTile) {
                this.firstSelectedTile = tile
                console.log('first tile selected')
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
                    this.swapTiles()
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

            this.tileGrid[(firstTilePosition.y - PADDING) / (TILE_SIZE + GAP)][
                (firstTilePosition.x - PADDING) / (TILE_SIZE + GAP)
            ] = this.secondSelectedTile
            this.tileGrid[(secondTilePosition.y - PADDING) / (TILE_SIZE + GAP)][
                (secondTilePosition.x - PADDING) / (TILE_SIZE + GAP)
            ] = this.firstSelectedTile

            this.scene.add.tween({
                targets: this.firstSelectedTile,
                x: this.secondSelectedTile.x,
                y: this.secondSelectedTile.y,
                ease: 'Linear',
                duration: 400,
                repeat: 0,
                yoyo: false,
            })

            this.scene.add.tween({
                targets: this.secondSelectedTile,
                x: this.firstSelectedTile.x,
                y: this.firstSelectedTile.y,
                ease: 'Linear',
                duration: 400,
                repeat: 0,
                yoyo: false,
                onComplete: () => {
                    this.checkMatches()
                },
            })
            this.canMove = true
            this.firstSelectedTile =
                this.tileGrid[(firstTilePosition.y - PADDING) / (TILE_SIZE + GAP)][
                    (firstTilePosition.x - PADDING) / (TILE_SIZE + GAP)
                ]
            this.secondSelectedTile =
                this.tileGrid[(secondTilePosition.y - PADDING) / (TILE_SIZE + GAP)][
                    (secondTilePosition.x - PADDING) / (TILE_SIZE + GAP)
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
                            y: PADDING + spaceY * (TILE_SIZE + GAP),
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
                    this.scene.add.tween({
                        targets: tile,
                        y: PADDING + y * (TILE_SIZE + GAP),
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
        for (let i = 0; i < matches.length; i++) {
            const tempArr = matches[i]

            for (let j = 0; j < tempArr.length; j++) {
                const tile = tempArr[j]
                //Find where this tile lives in the theoretical grid
                const tilePos = this.getTilePos(this.tileGrid, tile)
                console.log(tilePos)

                // Remove the tile from the theoretical grid
                if (tilePos.x !== -1 && tilePos.y !== -1) {
                    tile.destroy()
                    this.tileGrid[tilePos.y][tilePos.x] = undefined
                }
            }
        }
        console.log(this.tileGrid)
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
