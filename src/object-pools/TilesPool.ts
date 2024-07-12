import { TYPES } from '../constants'
import { Tile } from '../objects'
import ExplosionPool from './ExplosionPool'

class TilesPool {
    private tiles: { [key: string]: Tile[] } = {}
    private scene: Phaser.Scene
    private static instance: TilesPool
    private explosionPool: ExplosionPool

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        TYPES.forEach((type) => {
            this.tiles[type] = []
        })
        this.explosionPool = ExplosionPool.getInstance(this.scene)
    }

    public static getInstance(scene: Phaser.Scene): TilesPool {
        if (!TilesPool.instance) {
            TilesPool.instance = new TilesPool(scene)
        }
        return TilesPool.instance
    }

    public initializeWithSize(size: number): void {
        TYPES.forEach((type) => {
            if (this.tiles[type].length > 0 || size <= 0) {
                return
            }

            for (let i = 0; i < size; i++) {
                const tile = new Tile({
                    scene: this.scene,
                    x: 0,
                    y: 0,
                    texture: type,
                })
                tile.setVisible(false)
                tile.setActive(false)
                this.tiles[type].push(tile)
            }
        })
    }

    public spawn(x: number, y: number, type: string): Tile {
        let tile = this.tiles[type].find((tile) => !tile.active)
        if (!tile) {
            tile = new Tile({
                scene: this.scene,
                x: 0,
                y: 0,
                texture: type,
            })
            this.tiles[type].push(tile)
        } else {
            tile.setTexture(type)
        }
        tile.setPosition(x, y)
        tile.setVisible(true)
        tile.setActive(true)
        // if (!tile.emitter) {
        tile.emitter = this.explosionPool.spawn(x, y)
        // }
        tile.emitter.startFollow(tile)
        tile.emitter.setDepth(2)
        tile.state = 'spawned'
        return tile
    }

    public despawn(tile: Tile): void {
        tile.setVisible(false)
        tile.setActive(false)
        if (tile.emitter) {
            tile.emitter.explode(20)
            this.scene.time.delayedCall(1000, () => {
                this.explosionPool.despawn(tile.emitter)
            })
        }
        tile.state = 'despawned'
        // this.explosionPool.despawn(tile.emitter)?
    }
}

export default TilesPool
