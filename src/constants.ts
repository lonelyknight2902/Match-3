export const TYPES = ['item1', 'item2', 'item3', 'item4']
export const TILE_SIZE = 64
export const BOARD_WIDTH = 8
export const BOARD_HEIGHT = 8
export const PADDING = 20
export const GAP = 15
export const SCREEN_WIDTH = TILE_SIZE * BOARD_WIDTH + PADDING * 2 + GAP * (BOARD_WIDTH - 1) + 100
export const SCREEN_HEIGHT = (SCREEN_WIDTH * 3140) / 1451
export const T_SHAPE_PATTERN = [
    [
        [0, 0],
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, -2],
    ],
    [
        [0, 0],
        [-1, 0],
        [1, 0],
        [0, 1],
        [0, 2],
    ],
    [
        [0, 0],
        [-1, 0],
        [0, -1],
        [0, 1],
        [-2, 0]
    ],
    [
        [0, 0],
        [1, 0],
        [0, -1],
        [0, 1],
        [2, 0]
    ],
    [
        [0, 0],
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ],
    [
        [0, 0],
        [0, -1],
        [0, -2],
        [1, 0],
        [2, 0],
    ],
    [
        [0, 0],
        [0, -1],
        [0, -2],
        [-1, 0],
        [-2, 0],
    ],
    [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
        [2, 0],
    ],
    [
        [0, 0],
        [0, 1],
        [0, 2],
        [-1, 0],
        [-2, 0],
    ]
]
