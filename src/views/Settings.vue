<script setup>
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';

const store = useStore();
const router = useRouter();

const changeSetting = (key, value) => {
  store.commit('changeSettings', {key, value});
};

const goToGame = () => {
  router.push('game');
};
</script>

<template>
  <div class="flex flex-col items-stretch px-4 lg-px-16">
    <div class="settings-page p-4">
      <!-- Numbers to Memorize -->
      <div class="form-control mb-4">
        <label class="label">
        <span class="label-text">Numbers to Memorize:
          <span class="font-bold">{{ store.state.settings.numNumbers }}</span>
        </span>
        </label>
        <input
            type="range"
            min="3"
            max="20"
            :value="store.state.settings.numNumbers"
            @input="changeSetting('numNumbers', parseInt($event.target.value))"
            class="range range-primary"
        />
        <div class="w-full flex justify-between text-xs px-2">
          <span>3</span>
          <span>12</span>
          <span>20</span>
        </div>
      </div>

      <!-- Suggest Increase Difficulty -->
      <div class="form-control mb-4">
        <label class="label cursor-pointer">
          <span class="label-text">Suggest Increasing Difficulty</span>
          <input
              type="checkbox"
              :checked="store.state.settings.suggestIncreaseDifficulty"
              @change="changeSetting('suggestIncreaseDifficulty', $event.target.checked)"
              class="toggle toggle-primary"
          />
        </label>
      </div>

      <!-- Font Size -->
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">Font Size ({{ store.state.settings.fontSize }}xl)</span>
        </label>
        <input
            type="range"
            min="2"
            max="6"
            :value="store.state.settings.fontSize"
            @input="changeSetting('fontSize', parseInt($event.target.value))"
            class="range range-primary"
        />
        <div class="w-full flex justify-between text-xs px-2">
          <span>2xl</span>
          <span>3xl</span>
          <span>4xl</span>
          <span>5xl</span>
          <span>6xl</span>
        </div>
      </div>

      <!-- Cells Disappear On Click -->
      <div class="form-control mb-4">
        <label class="label cursor-pointer">
          <span class="label-text">Cells Disappear On Click</span>
          <input
              type="checkbox"
              :checked="store.state.settings.cellsDisappearOnClick"
              @change="changeSetting('cellsDisappearOnClick', $event.target.checked)"
              class="toggle toggle-primary"
          />
        </label>
      </div>

      <!-- Show GIF Pictures -->
      <div class="form-control mb-4">
        <label class="label cursor-pointer">
          <span class="label-text">Show GIF Pictures</span>
          <input
              type="checkbox"
              :checked="store.state.settings.showGifPictures"
              @change="changeSetting('showGifPictures', $event.target.checked)"
              class="toggle toggle-primary"
          />
        </label>
      </div>

      <!-- Go Button -->
      <div class="flex justify-end mt-6">
        <button class="btn btn-lg btn-primary" @click="goToGame">
          Start
          <i class="bi bi-play-fill mr-2"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style>
/* Add any additional styling here if needed */
</style>
