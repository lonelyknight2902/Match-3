import { ScoreManager } from '../managers'

class Milestone extends Phaser.GameObjects.Container {
    private milestoneText: Phaser.GameObjects.Text
    private progressBar: Phaser.GameObjects.Image
    private progressFill: Phaser.GameObjects.Image
    private scoreManager: ScoreManager
    private cropRect: Phaser.Geom.Rectangle
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter
    constructor(scene: Phaser.Scene) {
        super(scene)
        this.scoreManager = ScoreManager.getInstance(scene)
        const milestone = this.scoreManager.getMilestone()
        const score = this.scoreManager.getScore()
        this.milestoneText = scene.add.text(0, 0, `TARGET: ${milestone}`, {
            fontSize: '36px',
            color: '#fff',
            fontStyle: 'bold',
        })
        // this.milestoneText.setOrigin(0.5)
        this.progressBar = this.scene.add.image(0, 50, 'bar')
        this.progressBar.setOrigin(0)
        // this.progressBar.setScale(0.8)
        this.progressFill = this.scene.add.image(3, 53, 'fillBar')
        this.progressFill.setOrigin(0)
        // this.progressFill.setScale(0.8)
        this.cropRect = new Phaser.Geom.Rectangle(0, 0, 0, this.progressFill.displayHeight)
        this.progressFill.setCrop(this.cropRect)
        Phaser.Display.Align.In.LeftCenter(this.progressFill, this.progressBar, -3, 0)
        this.emitter = this.scene.add.particles(0, 0, 'star', {
            speed: { min: 10, max: 20 },
            lifespan: 1000,
            y: { min: 53, max: 53 + this.progressFill.displayHeight },
            blendMode: 'ADD',
            gravityY: 0,
            gravityX: -100,
            emitting: true,
            scale: { start: 0.07, end: 0 },
        })
        this.emitter.x = this.cropRect.width
        this.add(this.milestoneText)
        this.add(this.progressBar)
        this.add(this.progressFill)
        this.add(this.emitter)
        scene.add.existing(this)
    }

    update(...args: any[]): void {
        const milestone = this.scoreManager.getMilestone()
        const score = this.scoreManager.getScore()
        this.scene.tweens.add({
            targets: this.cropRect,
            width: this.progressFill.displayWidth * (score % 1000 / 1000),
            duration: 100,
            yoyo: true,
            repeat: 0,
        })
        this.progressFill.setCrop(this.cropRect)
        this.emitter.x = this.cropRect.width
        this.milestoneText.setText(`TARGET: ${milestone}`)
    }
}

export default Milestone
