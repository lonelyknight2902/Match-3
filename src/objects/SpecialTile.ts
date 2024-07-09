import { SpecialTileEffectPool } from '../object-pools'
import { ImageConstructor } from '../types/image'
import Tile from './Tile'

class SpecialTile extends Tile {
    constructor(params: ImageConstructor) {
        super(params)
        this.setTint(0xff0000)
        const specialTileEffectPool = SpecialTileEffectPool.getInstance(this.scene)
        this.specialEmitter = specialTileEffectPool.spawn(0, 0)
        this.specialEmitter.startFollow(this)
        this.specialEmitter.name = 'specialEmitter'
    }
}

export default SpecialTile
