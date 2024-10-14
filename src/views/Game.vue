<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import 'animate.css'
import party from 'party-js'
import GameEndModal from "@/components/GameEndModal.vue";

const store = useStore()
const cellSizePx = ref(0) // Cell size in pixels

const adjustCellSize = () => {
  // todo: 40 is hardcoded
  cellSizePx.value = Math.floor(Math.min(window.innerWidth / store.state.settings.gridNumCols, (window.innerHeight - 40) / store.state.settings.gridNumRows) * 0.9)
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
  if (store.state.settings.gameOver || !cell.hasNumber) {
    return
  }
  store.dispatch('handleCellClick', cell)
  if (cell.number === store.state.game.numNumbers && store.state.game.gameOver && cell.number <= store.state.game.currentNumber) {
    party.confetti(event.target)
  }
}

watch(
    () => store.state.game.gameOver,
    (newVal) => {
      if (newVal) {
        setTimeout(() => {
          win.value = store.state.game.currentNumber > store.state.settings.numNumbers
          gameOverModalOpen.value = true
        }, win.value ? 700 : 1200)
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
          class="grid gap-2 m-0 p-0"
          :style="{ gridTemplateColumns: 'repeat(' + store.state.settings.gridNumCols + ', ' + cellSizePx + 'px)' }"
      >
        <div
            v-for="cell in store.state.game.grid"
            :key="cell.id"
            @touchstart.prevent.stop="handleCellClick(cell, $event)"
            @mousedown.prevent.stop="handleCellClick(cell, $event)"
            class="flex items-center justify-center text-5xl font-bold rounded select-none"
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
  return cell.hasNumber ? 'border cursor-pointer shadow-md' : 'border'
}

const cellAnimationClass = (cell) => {
  if (cell.isError) {
    return 'animate__animated animate__headShake'
  } else if (cell.isCorrect) {
    return 'animate__animated animate__flip animate__faster' // TODO: animate__bounceOut if cellsDisappear
  } else {
    return ''
  }
}
</script>
