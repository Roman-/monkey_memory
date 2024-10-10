<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import 'animate.css'
import party from 'party-js'
import GameEndModal from "@/components/GameEndModal.vue";

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
  store.dispatch('resetGame')
})

const gameOverModalOpen = ref(false)
const win = ref(false)

const handleCellClick = (cell, event) => {
  if (store.state.gameOver || !cell.hasNumber) {
    return
  }
  store.dispatch('handleCellClick', cell)
  if (cell.number === store.state.numNumbers && store.state.gameOver && cell.number <= store.state.currentNumber) {
    party.confetti(event.target)
  }
}

watch(
    () => store.state.gameOver,
    (newVal) => {
      if (newVal) {
        setTimeout(() => {
          win.value = store.state.currentNumber > store.state.numNumbers
          gameOverModalOpen.value = true
        }, win.value ? 700 : 1500)
      }
    }
)

const closeModal = () => {
  gameOverModalOpen.value = false
}
</script>

<template>
  <div class="flex items-start justify-center">
    <div class="flex flex-col items-center my-4">
      <div
          class="grid gap-2"
          :style="{ gridTemplateColumns: 'repeat(' + store.state.gridNumCols + ', ' + cellSizePx + 'px)' }"
      >
        <div
            v-for="cell in store.state.grid"
            :key="cell.id"
            @mousedown.prevent="handleCellClick(cell, $event)"
            class="flex items-center justify-center text-2xl font-bold rounded select-none"
            :class="[cellBgClass(cell), cellAnimationClass(cell), cellVisibilityClass(cell)]"
            :style="{ width: cellSizePx + 'px', height: cellSizePx + 'px' }"
        >
          <span v-if="cell.isRevealed && cell.hasNumber">{{ cell.number }}</span>
        </div>
      </div>
      <GameEndModal :open="gameOverModalOpen" :win="win" @close="closeModal"/>
    </div>
  </div>
</template>

<script>
const cellBgClass = (cell) => {
  if (cell.isError) {
    return 'bg-error text-error-content'
  } else if (cell.isCorrect) {
    return 'bg-success text-success-content border border-success-content'
  } else if (cell.isRevealed && cell.hasNumber) {
    return 'bg-primary text-primary-content'
  } else if (cell.hasNumber) {
    return 'bg-primary text-primary-content'
  } else {
    return ''
  }
}

const cellVisibilityClass = (cell) => {
  return cell.hasNumber ? 'border cursor-pointer shadow-md' : ''
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
