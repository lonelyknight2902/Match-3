export function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}

export function flatten2DArray(array: any[]) {
    return array.reduce((acc, val) => acc.concat(val), [])
}


export function unflatten1DArray(array: any[], rows: number, cols: number) {
    const result = []
    for (let i = 0; i < rows; i++) {
        result.push(array.slice(i * cols, i * cols + cols))
    }
    return result
}
