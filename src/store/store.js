import { createStore } from 'vuex'
import { shuffle } from "@/js/helpers";
import {gameSettingsKey, getInitialSettings} from "@/js/gameSettings";

export const store = createStore({
    strict: true,
    state() {
        return {
            global: {
                showHint: true,
            },
            settings: getInitialSettings(),
            game: {
                currentNumber: 1,
                gameOver: false,
                grid: [],
                winImage: new Image(),
            },
        };
    },
    getters: {
        totalCells(state) {
            return state.settings.gridNumCols * state.settings.gridNumRows;
        },
    },
    mutations: {
        // data: {key: string, value: any}
        changeSettings(state, data) {
            if (!data.key in state.settings) {
                console.error(`Settings key ${data.key} not found`);
                return
            }
            state.settings[data.key] = data.value;
            localStorage.setItem(gameSettingsKey, JSON.stringify(state.settings));
        },

        // Game state mutations
        setCurrentNumber(state, number) {
            state.game.currentNumber = number;
            state.global.showHint = false;
        },
        setGameOver(state, value) {
            state.game.gameOver = value;
        },
        setGrid(state, grid) {
            state.game.grid = grid;
        },
        updateCell(state, { cellIndex, cellData }) {
            Object.assign(state.game.grid[cellIndex], cellData);
        },
        resetGame(state) {
            state.game.currentNumber = 1;
            state.game.gameOver = false;
            state.game.grid = [];
            const imgIndex = Math.floor(Math.random() * 10) + 1
            state.game.winImage = new Image()
            state.game.winImage.src = `img/game-over/win${imgIndex}.webp`
        },
    },
    actions: {
        generateGrid({ state, commit, getters }) {
            const cells = [];
            for (let i = 0; i < getters.totalCells; i++) {
                cells.push({
                    id: i,
                    hasNumber: false,
                    number: null,
                    isRevealed: false,
                    isCorrect: false,
                    isError: false,
                });
            }

            const indices = Array.from({ length: getters.totalCells }, (_, i) => i);
            const selectedIndices = shuffle(indices).slice(0, state.settings.numNumbers);

            for (let i = 0; i < state.settings.numNumbers; i++) {
                const index = selectedIndices[i];
                cells[index].hasNumber = true;
                cells[index].number = i + 1;
                cells[index].isRevealed = true;
            }

            commit('setGrid', cells);
        },
        handleCellClick({ state, commit }, cell) {
            if (
                state.game.gameOver ||
                !cell.hasNumber ||
                cell.number < state.game.currentNumber ||
                (state.game.currentNumber === 1 && cell.number > 1)
            ) {
                return;
            }

            const cellIndex = cell.id;

            if (cell.number === state.game.currentNumber) {
                // Correct cell clicked
                commit('updateCell', {
                    cellIndex,
                    cellData: { isRevealed: true, isCorrect: true },
                });

                if (state.game.currentNumber === 1) {
                    // Mask all other numbers when 1 is clicked
                    state.game.grid.forEach((c, index) => {
                        if (c.number !== 1) {
                            commit('updateCell', { cellIndex: index, cellData: { isRevealed: false } });
                        }
                    });
                }

                commit('setCurrentNumber', state.game.currentNumber + 1);

                if (state.game.currentNumber > state.settings.numNumbers) {
                    commit('setGameOver', true);
                }
            } else {
                commit('setGameOver', true); // Wrong cell clicked

                // Reveal only cells with numbers
                state.game.grid.forEach((c, index) => {
                    if (c.hasNumber) {
                        commit('updateCell', { cellIndex: index, cellData: { isRevealed: true } });
                    }
                });

                // Mark the wrongly clicked cell
                commit('updateCell', {
                    cellIndex,
                    cellData: { isError: true },
                });
            }
        },
        resetGame({ commit, dispatch }) {
            commit('resetGame');
            dispatch('generateGrid');
        },
    }
});
