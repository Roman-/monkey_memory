<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import {randomElement} from "@/js/helpers";

const props = defineProps({
  open: Boolean,
  win: Boolean,
})

const emit = defineEmits(['close'])

const store = useStore()
const modal = ref(null)

const congratulations = ["Congratulations!", "You've got it!", "Good job!", "Well done!", "Keep going!", "You're doing great!", "Great job!", "Excellent!", "You rock!", "Awesome!", "Impressive!", "Fantastic!", "Superb!", "Splendid!"]
const congratulationMessage = ref("")
const title = computed(() => (props.win ? congratulationMessage : `You've got ${store.state.game.currentNumber - 1} correct`))

const secondButtonDisabled = computed(() => {
  if (props.win) {
    return store.state.settings.numNumbers >= store.getters.totalCells
  } else {
    return store.state.settings.numNumbers <= 1
  }
})

const firstButtonAction = () => {
  if (!props.win) {
    store.commit('changeSettings', { key: 'numNumbers', value: store.state.settings.numNumbers - 1 })
  }
  store.dispatch('resetGame')
  closeModal()
}

const secondButtonAction = () => {
  if (props.win) {
    if (store.state.settings.numNumbers < store.getters.totalCells) {
      store.commit('changeSettings', { key: 'numNumbers', value: store.state.settings.numNumbers + 1 })
    } else {
      // todo increase grid size, update size
    }
  }
  store.dispatch('resetGame')
  closeModal()
}

const closeModal = () => {
  modal.value.close()
  emit('close')
}

watch(() => props.open, (newVal) => {
  if (newVal) {
    congratulationMessage.value = randomElement(congratulations)
    modal.value.showModal()
  } else {
    modal.value.close()
  }
})
</script>

<template>
  <dialog ref="modal" class="modal">
    <form method="dialog" class="modal-box">
      <h3 class="text-lg font-bold">{{ title }}</h3>
<!--      picture here-->
      <div class="modal-action">
        <button
            class="btn btn-neutral btn-outline"
            @click.prevent="firstButtonAction"
        >
          {{ props.win ? `Try ${store.state.settings.numNumbers} again` : `Easier: ${store.state.settings.numNumbers - 1}` }}
        </button>
        <button
            class="btn btn-primary"
            @click.prevent="secondButtonAction"
            :disabled="secondButtonDisabled"
            autofocus
        >
          {{ props.win ? `Next: ${store.state.settings.numNumbers + 1}` : `Try ${store.state.settings.numNumbers} again` }}
        </button>
      </div>
    </form>
  </dialog>
</template>