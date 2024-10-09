<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import 'animate.css'

const store = useStore()

const cellSizePx = ref(0) // Cell size in pixels

const adjustCellSize = () => {
  const screenMinSize = Math.min(window.innerWidth, window.innerHeight)
  const gridMaxCells = Math.max(store.state.gridNumRows, store.state.gridNumCols)
  cellSizePx.value = Math.floor((screenMinSize / gridMaxCells) * 0.7)
}

onMounted(() => {
  window.addEventListener('resize', adjustCellSize)
  adjustCellSize()
  store.dispatch('generateGrid')
})

onUnmounted(() => {
  window.removeEventListener('resize', adjustCellSize)
})

const grid = computed(() => store.state.grid)
const message = computed(() => store.state.message)

const handleCellClick = (cell) => {
  store.dispatch('handleCellClick', cell)
}

const resetGame = () => {
  store.dispatch('resetGame')
}

const cellClass = (cell) => {
  if (cell.isError) {
    return 'bg-error text-error-content border border-black'
  } else if (cell.isCorrect) {
    return 'bg-success text-success-content border border-black'
  } else if (cell.isRevealed && cell.hasNumber) {
    return 'bg-primary-content border border-black'
  } else if (cell.hasNumber) {
    return 'bg-neutral-300 border border-black'
  } else {
    return ''
  }
}

const cellAnimationClass = (cell) => {
  if (cell.isError) {
    return 'animate__animated animate__headShake'
  } else if (cell.isCorrect) {
    return 'animate__animated animate__flip animate__faster'
  } else {
    return ''
  }
}
</script>

<template>
  <div class="flex items-start justify-center min-h-screen">
    <div class="flex flex-col items-center">
      <div
          class="grid gap-3"
          :style="{ gridTemplateColumns: 'repeat(' + store.state.gridNumCols + ', ' + cellSizePx + 'px)' }"
      >
        <div
            v-for="cell in grid"
            :key="cell.id"
            @click="handleCellClick(cell)"
            class="flex items-center justify-center cursor-pointer text-xl font-bold rounded select-none"
            :class="[cellClass(cell), cellAnimationClass(cell)]"
            :style="{ width: cellSizePx + 'px', height: cellSizePx + 'px' }"
        >
          <span v-if="cell.isRevealed && cell.hasNumber">{{ cell.number }}</span>
        </div>
      </div>
      <p v-if="message" class="mt-2 animate__animated animate__fadeIn">{{ message }}</p>
      <button class="btn btn-primary mt-4" @click="resetGame">Reset Game</button>
    </div>
  </div>
</template>
