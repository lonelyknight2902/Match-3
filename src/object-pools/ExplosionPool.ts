class ExplosionPool {
    private emitters: Phaser.GameObjects.Particles.ParticleEmitter[]
    private scene: Phaser.Scene
    private static instance: ExplosionPool
    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.emitters = []
    }

    public static getInstance(scene: Phaser.Scene): ExplosionPool {
        if (!ExplosionPool.instance) {
            ExplosionPool.instance = new ExplosionPool(scene)
        }
        return ExplosionPool.instance
    }

    public initializeWithSize(size: number): void {
        if (this.emitters.length > 0 || size <= 0) {
            return
        }

        for (let i = 0; i < size; i++) {
            const emitter = this.scene.add.particles(0, 0, 'star', {
                speed: { min: 100, max: 200 },
                lifespan: 1000,
                blendMode: 'ADD',
                gravityY: 100,
                emitting: false,
                scale: { start: 0.1, end: 0 },
            })
            emitter.setVisible(false)
            emitter.setActive(false)
            this.emitters.push(emitter)
        }
    }

    public spawn(x: number, y: number): Phaser.GameObjects.Particles.ParticleEmitter {
        let emitter = this.emitters.find((emitter) => !emitter.active)
        if (!emitter) {
            emitter = this.scene.add.particles(0, 0, 'star', {
                speed: { min: 100, max: 200 },
                lifespan: 1000,
                blendMode: 'ADD',
                gravityY: 100,
                emitting: false,
                scale: { start: 0.1, end: 0 },
            })
            this.emitters.push(emitter)
        }
        emitter.setVisible(true)
        emitter.setActive(true)
        console.log(this.emitters.length)
        return emitter
    }

    public despawn(emitter: Phaser.GameObjects.Particles.ParticleEmitter): void {
        // emitter.stop()
        if (emitter) {
            emitter.setVisible(false)
            emitter.setActive(false)
            emitter.stopFollow()
        }
    }
}

export default ExplosionPool
