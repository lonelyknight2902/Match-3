import { BOARD_HEIGHT, BOARD_WIDTH } from '../constants'
import { SpecialTileEffectPool } from '../object-pools'
import { ImageConstructor } from '../types/image'
import { flatten2DArray } from '../utils'
import Grid from './Grid'
import Tile from './Tile'

class HyperTile extends Tile {
    private key: string
    constructor(params: ImageConstructor) {
        super({...params, texture: 'choco'})
        const specialTileEffectPool = SpecialTileEffectPool.getInstance(this.scene)
        this.specialEmitter = specialTileEffectPool.spawn(0, 0)
        this.specialEmitter.startFollow(this)
        this.specialEmitter.name = 'specialEmitter'
        this.specialEmitter.setDepth(-1)
        this.texture.key = 'choco'
    }

    public getExplodedTile(grid: Grid, key: string): (Tile | undefined)[] {
        const tileGrid = grid.getTileGrid()
        const tilePos = grid.getTilePos(tileGrid, this)
        const tiles = []
        if (tilePos.x !== -1 && tilePos.y !== -1) {
            for (let i = 0; i < BOARD_HEIGHT; i++) {
                for (let j = 0; j < BOARD_WIDTH; j++) {
                    const explodedTile = tileGrid[i][j]
                    if (
                        explodedTile &&
                        explodedTile.texture.key.includes(key) &&
                        (i != tilePos.y || j != tilePos.x)
                    ) {
                        tiles.push(explodedTile)
                    }
                }
            }
        }

        return tiles
    }

    public swapDestroy(grid: Grid, tile: Tile): (Tile | undefined)[] {
        if (tile instanceof HyperTile) {
            return flatten2DArray(grid.getTileGrid())
        } else {
            return this.getExplodedTile(grid, tile.texture.key)
        }
    }
}

export default HyperTile
