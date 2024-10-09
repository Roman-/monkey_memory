import { createStore } from 'vuex'

export const store = createStore({
    strict: true,
    state () {
        return {
            gridNumRows: 8,
            gridNumCols: 8,
            numNumbers: 3
        }
    },
    getters: {
        totalCells (state) {
            return state.gridNumCols * state.gridNumRows
        }
    },
    mutations: {
        setNumNumbers (state, amount) {
            state.numNumbers = amount
        },
    },
    actions: {
    }
})
