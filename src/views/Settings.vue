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
        <span class="label-text">Difficulty (amount of numbers):
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

      <!-- Fix Difficulty -->
      <div class="form-control mb-4">
        <label class="label cursor-pointer">
          <span class="label-text">Fixed difficulty</span>
          <input
              type="checkbox"
              :checked="store.state.settings.fixedDifficulty"
              @change="changeSetting('fixedDifficulty', $event.target.checked)"
              class="toggle toggle-primary"
          />
        </label>
      </div>

      <!-- Show GIF Pictures -->
      <div class="form-control mb-4">
        <label class="label cursor-pointer">
          <span class="label-text">Show GIF on win</span>
          <input
              type="checkbox"
              :checked="store.state.settings.showGifPictures"
              @change="changeSetting('showGifPictures', $event.target.checked)"
              class="toggle toggle-primary"
          />
        </label>
      </div>

      <!-- Number of Games -->
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">Number of Games</span>
        </label>
        <select
            :value="store.state.settings.numGames"
            @change="changeSetting('numGames', parseInt($event.target.value))"
            class="select select-bordered w-full"
        >
          <option :value="0">Unlimited</option>
          <option v-for="n in [1, 3, 5, 7, 10]" :key="n" :value="n">
            {{ n }}
          </option>
        </select>
      </div>
      <!-- Start game Button -->
      <div class="flex justify-end mt-6">
        <button class="btn btn-lg btn-primary" @click="goToGame">
          Start
          <i class="bi bi-play-fill mr-2"></i>
        </button>
      </div>
    </div>
  </div>
</template>
