import { createStore } from 'vuex'

export const store = createStore({
    strict: true,
    state() {
        return {
            gridNumRows: 7,
            gridNumCols: 7,
            numNumbers: 3,
            currentNumber: 1,
            gameOver: false,
            message: '',
            grid: [],
        }
    },
    getters: {
        totalCells(state) {
            return state.gridNumCols * state.gridNumRows
        },
    },
    mutations: {
        setNumNumbers(state, amount) {
            state.numNumbers = amount
        },
        setCurrentNumber(state, number) {
            state.currentNumber = number
        },
        setGameOver(state, value) {
            state.gameOver = value
        },
        setMessage(state, msg) {
            state.message = msg
        },
        setGrid(state, grid) {
            state.grid = grid
        },
        updateCell(state, { cellIndex, cellData }) {
            Object.assign(state.grid[cellIndex], cellData)
        },
        resetGameState(state) {
            state.currentNumber = 1
            state.gameOver = false
            state.message = ''
            state.grid = []
        },
    },
    actions: {
        generateGrid({ state, commit, getters }) {
            const cells = []
            for (let i = 0; i < getters.totalCells; i++) {
                cells.push({
                    id: i,
                    hasNumber: false,
                    number: null,
                    isRevealed: false,
                    isCorrect: false,
                    isError: false,
                })
            }

            const indices = Array.from({ length: getters.totalCells }, (_, i) => i)
            shuffleArray(indices)
            const selectedIndices = indices.slice(0, state.numNumbers)

            for (let i = 0; i < state.numNumbers; i++) {
                const index = selectedIndices[i]
                cells[index].hasNumber = true
                cells[index].number = i + 1
                cells[index].isRevealed = true
            }

            commit('setGrid', cells)
        },
        handleCellClick({ state, commit }, cell) {
            if (
                state.gameOver ||
                !cell.hasNumber ||
                cell.number < state.currentNumber ||
                (state.currentNumber === 1 && cell.number > 1)
            ) {
                return
            }

            const cellIndex = cell.id

            if (cell.number === state.currentNumber) {
                // Correct cell clicked
                commit('updateCell', {
                    cellIndex,
                    cellData: { isRevealed: true, isCorrect: true },
                })

                if (state.currentNumber === 1) {
                    // Mask all other numbers when 1 is clicked
                    state.grid.forEach((c, index) => {
                        if (c.number !== 1) {
                            commit('updateCell', { cellIndex: index, cellData: { isRevealed: false } })
                        }
                    })
                }

                commit('setCurrentNumber', state.currentNumber + 1)

                if (state.currentNumber > state.numNumbers) {
                    commit('setMessage', 'Congratulations! You completed the game.')
                    commit('setGameOver', true)
                }
            } else {
                // Wrong cell clicked
                commit('setMessage', `Wrong cell! You should click on number ${state.currentNumber}.`)
                commit('setGameOver', true)

                // Reveal only cells with numbers
                state.grid.forEach((c, index) => {
                    if (c.hasNumber) {
                        commit('updateCell', { cellIndex: index, cellData: { isRevealed: true } })
                    }
                })

                // Mark the wrongly clicked cell
                commit('updateCell', {
                    cellIndex,
                    cellData: { isError: true },
                })
            }
        },
        resetGame({ commit, dispatch }) {
            commit('resetGameState')
            dispatch('generateGrid')
        },
    },
})

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
}
