<template>
  <dialog ref="modal" class="modal">
    <form method="dialog" class="modal-box">
      <h3 class="text-lg font-bold">{{ title }}</h3>
      <p class="py-4">{{ message }}</p>
      <div class="modal-action">
        <button
            class="btn btn-neutral btn-outline"
            @click.prevent="firstButtonAction"
            :disabled="firstButtonDisabled"
        >
          {{ firstButtonText }}
        </button>
        <button
            class="btn btn-primary"
            @click.prevent="secondButtonAction"
            :disabled="secondButtonDisabled"
            autofocus
        >
          {{ secondButtonText }}
        </button>
      </div>
    </form>
  </dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  open: Boolean,
  win: Boolean,
})

const emit = defineEmits(['close'])

const store = useStore()
const modal = ref(null)

const title = computed(() => (props.win ? 'Congratulations!' : 'Game Over'))
const message = computed(() => store.state.message)

const firstButtonText = 'Try again'

const secondButtonText = computed(() => {
  if (props.win) {
    return 'Next (' + (store.state.numNumbers + 1) + ' numbers)'
  } else {
    return 'Easier (' + (store.state.numNumbers - 1) + ' numbers)'
  }
})

const firstButtonDisabled = computed(() => {
  // "Try again" button is always enabled
  return false
})

const secondButtonDisabled = computed(() => {
  if (props.win) {
    return store.state.numNumbers >= store.getters.totalCells
  } else {
    return store.state.numNumbers <= 1
  }
})

  const firstButtonAction = () => {
    // Try again with current number
    store.dispatch('resetGame')
    closeModal()
  }

  const secondButtonAction = () => {
    if (props.win) {
      // Advance the number of numbers
      if (store.state.numNumbers < store.getters.totalCells) {
        store.commit('setNumNumbers', store.state.numNumbers + 1)
        store.dispatch('resetGame')
      }
    } else {
      // Try with fewer numbers
      if (store.state.numNumbers > 1) {
        store.commit('setNumNumbers', store.state.numNumbers - 1)
        store.dispatch('resetGame')
      }
    }
    closeModal()
  }

  const closeModal = () => {
    modal.value.close()
    emit('close')
  }

  watch(
      () => props.open,
      (newVal) => {
        if (newVal) {
          modal.value.showModal()
        } else {
          modal.value.close()
        }
      }
  )
</script>
