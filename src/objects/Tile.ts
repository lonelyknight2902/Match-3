import { TILE_SIZE } from "../constants"
import { ExplosionPool } from "../object-pools";
import { ImageConstructor } from "../types/image"

class Tile extends Phaser.GameObjects.Image {
    public position: { x: number; y: number }
    public emitter: Phaser.GameObjects.Particles.ParticleEmitter
    public specialEmitter: Phaser.GameObjects.Particles.ParticleEmitter
    constructor(params: ImageConstructor) {
        super(params.scene, params.x, params.y, params.texture)
        this.setOrigin(0.5, 0.5)
        this.setInteractive()
        this.scene = params.scene
        this.scene.add.existing(this)
        this.scene.input.setDraggable(this)
        // this.setScale(0.1)
        this.displayWidth = TILE_SIZE
        this.displayHeight = TILE_SIZE
        this.width = TILE_SIZE
        this.height = TILE_SIZE
        // this.emitter = params.scene.add.particles(this.x, this.y, 'star', {
        //     speed: { min: 100, max: 200 },
        //     lifespan: 1000,
        //     blendMode: 'ADD',
        //     gravityY: 100,
        //     emitting: false,
        //     scale: { start: 0.1, end: 0 },
        // })
        const explosionPool = ExplosionPool.getInstance(this.scene)
        this.emitter = explosionPool.spawn(0, 0)
        this.emitter.startFollow(this)
        this.emitter.setDepth(2)
        // this.emitter.startFollow(this)
    }
}

export default Tile
