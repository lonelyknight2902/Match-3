import State from '../State'

class IdleState extends State {
    enter(): void {
        throw new Error('Method not implemented.')
    }
    exit(): void {
        throw new Error('Method not implemented.')
    }
    execute(time: number, delta: number): void {
        throw new Error('Method not implemented.')
    }
}

export default IdleState
