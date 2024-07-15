import { SCREEN_HEIGHT, SCREEN_WIDTH, TAU } from '../../constants'
import { ScoreManager } from '../../managers'
import { Complete, Grid } from '../../objects'
import State from '../State'

class MilestoneState extends State {
    private grid: Grid
    private scene: Phaser.Scene
    private elapsedTime: number
    private scoreManager: ScoreManager
    private shuffled: boolean
    private confetti: Phaser.GameObjects.Particles.ParticleEmitter
    private overlay: Phaser.GameObjects.Graphics
    private completeMenu: Complete
    private cheers: Phaser.Sound.BaseSound
    private levelComplete: Phaser.Sound.BaseSound
    constructor(grid: Grid, scene: Phaser.Scene) {
        super()
        this.grid = grid
        this.scene = scene
        this.elapsedTime = 0
        this.scoreManager = ScoreManager.getInstance(this.scene)
        this.shuffled = false
        this.cheers = this.scene.sound.add('cheers')
        this.levelComplete = this.scene.sound.add('levelComplete')
        this.overlay = this.scene.add.graphics()
        this.overlay.fillStyle(0x000000, 0)
        this.overlay.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
        this.completeMenu = new Complete(this.scene)
        this.completeMenu.setPosition(0, -2000)
        this.confetti = this.scene.add.particles(0, 0, 'confetti', {
            frequency: 1000 / 60,
            lifespan: 10000,
            speedY: { min: -6000, max: -4000 },
            speedX: { min: -500, max: 500 },
            angle: { min: -85, max: -95 },
            gravityY: 1000,
            frame: [0, 4, 8, 12, 16],
            quantity: 100,
            x: { min: 0, max: 800 },
            emitting: false,
            scaleX: {
                onEmit: (particle) => {
                    return 1
                },
                onUpdate: (particle) => {
                    // 4 cycles per lifespan
                    return Math.cos(TAU * 4 * particle.lifeT)
                },
            },
            rotate: {
                onEmit: (particle) => {
                    return 0
                },
                onUpdate: (particle) => {
                    // 2 cycles per lifespan
                    return 2 * 360 * Math.sign(particle.velocityX) * particle.lifeT
                },
            },
            accelerationX: {
                onEmit: (particle) => {
                    return 0
                },
                onUpdate: (particle) => {
                    return -particle.velocityX * Phaser.Math.Between(0, 1)
                },
            },
            accelerationY: {
                onEmit: (particle) => {
                    return 0
                },
                onUpdate: (particle) => {
                    return -particle.velocityY * Phaser.Math.Between(3, 4)
                },
            },
        })
        // this.confetti.stop()
    }
    public enter(): void {
        console.log('MilestoneState: enter')
        // this.grid.stateMachine.transition('shuffle')
        this.scoreManager.setMilestone(
            Math.floor(this.scoreManager.getScore() / 1000) * 1000 + 1000
        )
        this.cheers.play()
        this.levelComplete.play()
        this.confetti.explode(200, SCREEN_WIDTH / 2, SCREEN_HEIGHT)
        this.scene.tweens.add({
            targets: this.completeMenu,
            y: 0,
            duration: 500,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.completeMenu.display()
                this.scene.time.delayedCall(3000, () => {
                    this.scene.tweens.add({
                        targets: this.completeMenu,
                        y: -2000,
                        duration: 500,
                        ease: 'Bounce',
                    })
                })
            },
        })
        this.scene.tweens.add({
            targets: this.overlay,
            alpha: 0.5,
            duration: 500,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.scene.time.delayedCall(3000, () => {
                    this.scene.tweens.add({
                        targets: this.overlay,
                        alpha: 0,
                        duration: 500,
                        ease: 'Quad.easeOut',
                    })
                })
            }
        })
    }

    public exit(): void {
        console.log('MilestoneState: exit')
        this.elapsedTime = 0
        this.shuffled = false
        // this.confetti.stop()
    }

    public execute(time: number, delta: number): void {
        this.elapsedTime += delta
        // if (this.elapsedTime > 2000 && !this.shuffled) {
        //     this.grid.stateMachine.transition('shuffle')

        //     this.shuffled = true
        // }
        console.log('MilestoneState: execute')
        if (this.elapsedTime > 4000 && this.grid.stateMachine.getState() !== 'shuffle') {
            this.stateMachine.transition('play')
        }
    }
}

export default MilestoneState
