<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import {randomElement} from "@/js/helpers";

const props = defineProps({
  open: Boolean,
  win: Boolean,
})

const emit = defineEmits(['close'])
const imageSrc = ref("")

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

const resetGameAndClose = () => {
  store.dispatch('resetGame')
  closeModal()
}

const firstButtonAction = () => {
  if (!props.win) {
    store.commit('changeSettings', { key: 'numNumbers', value: store.state.settings.numNumbers - 1 })
  }
  resetGameAndClose()
}

const secondButtonAction = () => {
  if (props.win) {
    if (store.state.settings.numNumbers < store.getters.totalCells) {
      store.commit('changeSettings', { key: 'numNumbers', value: store.state.settings.numNumbers + 1 })
    } else {
      // todo increase grid size, update size
    }
  }
  resetGameAndClose()
}

const closeModal = () => {
  modal.value.close()
  emit('close')
}

watch(() => props.open, (newVal) => {
  if (newVal) {
    congratulationMessage.value = randomElement(congratulations)
    // Don't bind to winImage directly because when dialog is closed, image is changed, and you can see the new image
    imageSrc.value = store.state.game.winImage.src
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

      <img
          v-show="store.state.settings.showGifPictures && props.win"
          :src="imageSrc"
          class="w-full my-2 animate__animated animate__fadeIn animate__faster"
      />

      <!-- two buttons-->
      <div v-if="store.state.settings.suggestIncreaseDifficulty">
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
      </div>

      <!-- single button-->
      <div v-else>
        <div class="modal-action">
          <button
              class="btn btn-primary"
              @click.prevent="resetGameAndClose"
              :disabled="secondButtonDisabled"
              autofocus
          >
            Play again
          </button>
        </div>
      </div>

    </form>
  </dialog>
</template>