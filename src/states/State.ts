import StateMachine from './StateMachine'

abstract class State {
    public stateMachine: StateMachine
    abstract enter(): void
    abstract exit(): void
    abstract execute(time: number, delta: number): void
}

export default State
