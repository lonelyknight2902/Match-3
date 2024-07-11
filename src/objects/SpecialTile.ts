import { BOARD_HEIGHT, BOARD_WIDTH } from '../constants'
import { SpecialTileEffectPool } from '../object-pools'
import { ImageConstructor } from '../types/image'
import Grid from './Grid'
import Tile from './Tile'

class SpecialTile extends Tile {
    constructor(params: ImageConstructor) {
        super(params)
        const specialTileEffectPool = SpecialTileEffectPool.getInstance(this.scene)
        this.specialEmitter = specialTileEffectPool.spawn(0, 0)
        this.specialEmitter.startFollow(this)
        this.specialEmitter.name = 'specialEmitter'
        this.specialEmitter.setDepth(-1)
    }

    public getExplodedTile(grid: Grid): (Tile | undefined)[] {
        const tileGrid = grid.getTileGrid()
        const tilePos = grid.getTilePos(tileGrid, this)
        const tiles = []
        if (tilePos.x !== -1 && tilePos.y !== -1) {
            for (let i = tilePos.y - 1; i <= tilePos.y + 1; i++) {
                for (let j = tilePos.x - 1; j <= tilePos.x + 1; j++) {
                    if (i >= 0 && i < BOARD_HEIGHT && j >= 0 && j < BOARD_WIDTH) {
                        const explodedTile = tileGrid[i][j]
                        if ((i != tilePos.y || j != tilePos.x) && explodedTile) {
                            tiles.push(explodedTile)
                        }
                    }
                }
            }
        }

        return tiles
    }
}

export default SpecialTile
