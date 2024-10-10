<script setup>

import {useRouter} from "vue-router";
import ThemeController from "@/components/navbar/ThemeController.vue";
import {store} from "../../store/store";

const router = useRouter();

</script>

<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl" @click="router.push('/')">
        {{store.state.showHint ? "Click '1'" : "Monkey memory"}}
      </a>
    </div>
    <div class="flex-none">
<!--      <LangDropdown/>-->
      <ThemeController/>
    </div>
  </div>
</template>

<style scoped>

</style>
