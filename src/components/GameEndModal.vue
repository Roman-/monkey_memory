<script setup>
import { computed, ref, watch } from 'vue'
import {randomElement} from "@/js/helpers";
import {store} from "@/store/store";

const props = defineProps({
  open: Boolean,
  win: Boolean,
})

const emit = defineEmits(['close'])
const imageSrc = ref("")
const isPenaltyWaining = ref(false);

const isFinalGame = computed(() =>
    store.state.settings.numGames > 0 && store.state.game.totalGamesPlayed >= store.state.settings.numGames );

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
    if (props.win || store.state.settings.loosePenaltySec === 0) {
      isPenaltyWaining.value = false
    } else {
      isPenaltyWaining.value = true
      setTimeout(() => {
        isPenaltyWaining.value = false
      }, store.state.settings.loosePenaltySec * 1000)
    }
    modal.value.showModal()
  } else {
    modal.value.close()
  }
})

const gamesLeftMsg = computed(() => {
  if (store.state.settings.numGames === 0) {
    return ""
  }
  if (store.state.game.totalGamesPlayed === store.state.settings.numGames) {
    return "No games left";
  }
  if (store.state.game.totalGamesPlayed === store.state.settings.numGames - 1) {
    return "Last game";
  }
  return (store.state.settings.numGames -  store.state.game.totalGamesPlayed) + " games left"
})
</script>

<template>
  <dialog ref="modal" class="modal">
    <form method="dialog" class="modal-box">
      <div class="flex justify-between">
        <h3 class="text-lg font-bold">{{ title }}</h3>
        <span class="ml-2 text-neutral text-sm">
          {{gamesLeftMsg}}
        </span>
      </div>

      <img
          v-show="store.state.settings.showGifPictures && props.win"
          :src="imageSrc"
          class="w-full my-2 animate__animated animate__fadeIn animate__faster"
      />

      <div v-if="isFinalGame" class="text-neutral text-sm">
        Reload page to play again. You can disable this in the settings (number of games).
      </div>
      <div v-else>
        <div v-if="store.state.settings.loosePenaltySec !== 0 && !props.win" class="text-neutral text-sm mt-2">
          Waiting {{ store.state.settings.loosePenaltySec }} seconds to play again. You can disable this in the settings.
          <span v-if="isPenaltyWaining" class="loading loading-bars loading-xs px-2"/>
        </div>
        <!-- single button-->
        <div v-if="store.state.settings.fixedDifficulty">
          <div class="modal-action">
            <button
                class="btn btn-primary"
                @click.prevent="resetGameAndClose"
                :disabled="secondButtonDisabled || isPenaltyWaining"
                autofocus
            >
              Play again
            </button>
          </div>
        </div>

        <!-- two buttons-->
        <div v-else>
          <div class="modal-action">
            <button
                class="btn btn-neutral btn-outline"
                @click.prevent="firstButtonAction"
                :disabled="isPenaltyWaining"
            >
              {{ props.win ? `Try ${store.state.settings.numNumbers} again` : `Easier: ${store.state.settings.numNumbers - 1}` }}
            </button>
            <button
                class="btn btn-primary"
                @click.prevent="secondButtonAction"
                :disabled="secondButtonDisabled || isPenaltyWaining"
                autofocus
            >
              {{ props.win ? `Next: ${store.state.settings.numNumbers + 1}` : `Try ${store.state.settings.numNumbers} again` }}
            </button>
          </div>
        </div>
      </div>

    </form>
  </dialog>
</template>