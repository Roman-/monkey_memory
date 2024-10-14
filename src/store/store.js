import { createStore } from 'vuex'
import {shuffle} from "@/js/helpers";

export const store = createStore({
    strict: true,
    state() {
        return {
            showHint: true,
            gridNumRows: 6,
            gridNumCols: 5,
            numNumbers: 3,
            currentNumber: 1,
            gameOver: false,
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
            state.showHint = false
        },
        setGameOver(state, value) {
            state.gameOver = value
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
            const selectedIndices = shuffle(indices).slice(0, state.numNumbers)

            for (let i = 0; i < state.numNumbers; i++) {
                const index = selectedIndices[i]
                cells[index].hasNumber = true
                cells[index].number = i + 1
                cells[index].isRevealed = true
            }

            commit('setGrid', cells)
        },
        handleCellClick({ state, commit }, cell) {
            if (state.gameOver ||
                !cell.hasNumber ||
                cell.number < state.currentNumber ||
                (state.currentNumber === 1 && cell.number > 1)) {
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
                    commit('setGameOver', true)
                }
            } else {
                commit('setGameOver', true) // Wrong cell clicked

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
