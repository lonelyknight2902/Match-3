import { BOARD_HEIGHT, BOARD_WIDTH } from '../constants'
import { SpecialTileEffectPool } from '../object-pools'
import { ImageConstructor } from '../types/image'
import Grid from './Grid'
import Tile from './Tile'

class HyperTile extends Tile {
    private key: string
    constructor(params: ImageConstructor) {
        super(params)
        const specialTileEffectPool = SpecialTileEffectPool.getInstance(this.scene)
        this.specialEmitter = specialTileEffectPool.spawn(0, 0)
        this.specialEmitter.startFollow(this)
        this.specialEmitter.name = 'specialEmitter'
        this.specialEmitter.setDepth(-1)
        this.key = params.texture.slice(0, 5)
    }

    public getExplodedTile(grid: Grid): (Tile | undefined)[] {
        const tileGrid = grid.getTileGrid()
        const tilePos = grid.getTilePos(tileGrid, this)
        const tiles = []
        if (tilePos.x !== -1 && tilePos.y !== -1) {
            for (let i = 0; i < BOARD_HEIGHT; i++) {
                for (let j = 0; j < BOARD_WIDTH; j++) {
                    const explodedTile = tileGrid[i][j]
                    if (
                        explodedTile &&
                        explodedTile.texture.key.includes(this.key) &&
                        (i != tilePos.y || j != tilePos.x)
                    ) {
                        tiles.push(explodedTile)
                    }
                }
            }
        }

        return tiles
    }
}

export default HyperTile
