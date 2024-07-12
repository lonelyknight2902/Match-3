class ScoreManager {
    private score: number
    private milestone: number
    private multiplier: number
    private scene: Phaser.Scene
    private scoreText: Phaser.GameObjects.Text
    private static instance: ScoreManager

    private constructor(scene: Phaser.Scene) {
        this.score = 0
        this.milestone = 1000
        this.multiplier = 1
        this.scene = scene
        this.scoreText = this.scene.add.text(0, 0, `${this.score}`, {
            fontSize: '80px',
            color: '#fff',
            fontStyle: 'bold',
            align: 'center',
        })
        this.scoreText.setOrigin(0.5)
    }

    public static getInstance(scene: Phaser.Scene): ScoreManager {
        if (!ScoreManager.instance) {
            ScoreManager.instance = new ScoreManager(scene)
        }
        return ScoreManager.instance
    }

    public getScore(): number {
        return this.score
    }

    public setScore(value: number) {
        this.score = value
    }

    public addScore(value: number): void {
        this.score += value
        this.scene.tweens.add({
            targets: this.scoreText,
            scale: 1.2,
            duration: 100,
            yoyo: true,
            repeat: 0,
        })
        // if(this.score >= this.milestone) {
        //     this.milestone += 1000
        //     // this.multiplier++
        // }
    }

    public getScoreText(): Phaser.GameObjects.Text {
        return this.scoreText
    }

    public update(): void {
        this.scoreText.setText(`${this.score}`)
    }

    public getMilestone(): number {
        return this.milestone
    }

    public setMilestone(value: number): void {
        this.milestone = value
    }

    public resetScore(): void {
        this.score = 0
    }

    public resetMilestone(): void {
        this.milestone = 1000
    }

    public getMultiplier(): number {
        return this.multiplier
    }

    public setMultiplier(value: number): void {
        this.multiplier = value
    }

    public matchScore(type: string, tileDestroyed: number): number {
        let score = 0
        switch (type) {
            case '3':
                score = 100 * this.multiplier
                // return 100 * this.multiplier
                break
            case '4':
                score = 200 * this.multiplier
                break
            case '5':
                score = 300 * this.multiplier
                break
            case 'T':
                score = 400 * this.multiplier
                break
            case 'special':
                score = 100 * tileDestroyed * this.multiplier
                break
            default:
                score = 10 * tileDestroyed * this.multiplier
                break
        }
        this.addScore(score)
        return Math.floor(score)
    }
}

export default ScoreManager
