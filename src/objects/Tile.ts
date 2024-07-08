import { TILE_SIZE } from "../constants"
import { ImageConstructor } from "../types/image"

class Tile extends Phaser.GameObjects.Image {
    public position: { x: number; y: number }
    constructor(params: ImageConstructor) {
        super(params.scene, params.x, params.y, params.texture)
        this.setOrigin(0, 0)
        this.setInteractive()
        this.scene = params.scene
        this.scene.add.existing(this)
        this.scene.input.setDraggable(this)
        // this.setScale(0.1)
        this.displayWidth = TILE_SIZE
        this.displayHeight = TILE_SIZE
    }
}

export default Tile
