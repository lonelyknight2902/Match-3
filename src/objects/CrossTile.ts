import { BOARD_HEIGHT, BOARD_WIDTH } from '../constants'
import { SpecialTileEffectPool } from '../object-pools'
import { ImageConstructor } from '../types/image'
import Grid from './Grid'
import Tile from './Tile'

class CrossTile extends Tile {
    constructor(params: ImageConstructor) {
        super(params)
        const specialTileEffectPool = SpecialTileEffectPool.getInstance(this.scene)
        this.specialEmitter = specialTileEffectPool.spawn(0, 0)
        this.specialEmitter.startFollow(this)
        this.specialEmitter.name = 'specialEmitter'
        this.specialEmitter.setDepth(-10)
    }

    public getExplodedTile(grid: Grid): (Tile | undefined)[] {
        const tileGrid = grid.getTileGrid()
        const tilePos = grid.getTilePos(tileGrid, this)
        const tiles = []
        if (tilePos.x !== -1 && tilePos.y !== -1) {
            for (let i = 0; i < BOARD_HEIGHT; i++) {
                const explodedTile = tileGrid[i][tilePos.x]
                if (explodedTile && i !== tilePos.y) {
                    tiles.push(explodedTile)
                }
            }

            for (let i = 0; i < BOARD_WIDTH; i++) {
                const explodedTile = tileGrid[tilePos.y][i]
                if (explodedTile && i !== tilePos.x) {
                    tiles.push(explodedTile)
                }
            }
        }

        return tiles
    }
}

export default CrossTile
