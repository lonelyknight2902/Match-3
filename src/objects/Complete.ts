import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants'
import { ScoreManager } from '../managers'

class Complete extends Phaser.GameObjects.Container {
    private popup: Phaser.GameObjects.Image
    private scoreManager: ScoreManager
    private milestoneReachText: Phaser.GameObjects.Text
    private scoreText: Phaser.GameObjects.Text
    constructor(scene: Phaser.Scene) {
        super(scene)
        this.scene = scene
        this.scoreManager = ScoreManager.getInstance(scene)
        this.popup = this.scene.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 'popup')
        this.popup.setScale(1.5)
        this.milestoneReachText = this.scene.add.text(0, 0, 'MILESTONE REACHED', {
            fontSize: '34px',
            color: '#fff',
            fontStyle: 'bold',
        })
        this.milestoneReachText.setOrigin(0.5)
        Phaser.Display.Align.In.TopCenter(this.milestoneReachText, this.popup, 0, 30)
        this.popup.setOrigin(0.5)
        this.add(this.popup)
        this.add(this.milestoneReachText)
        this.scoreText = this.scene.add.text(0, 0, `${this.scoreManager.getScore()}`, {
            fontSize: '80px',
            color: '#000',
            fontStyle: 'bold',
            align: 'center',
        })
        this.scoreText.setOrigin(0.5)
        Phaser.Display.Align.In.Center(this.scoreText, this.popup)
        this.add(this.scoreText)
        scene.add.existing(this)
    }

    public display(): void {
        this.scene.tweens.addCounter({
            from: 0,
            to: this.scoreManager.getScore(),
            duration: 1000,
            onUpdate: (tween) => {
                this.scoreText.setText(`${Math.floor(tween.getValue())}`)
            },
        })
    }
}

export default Complete
