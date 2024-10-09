<script setup>

import {useRouter} from "vue-router";
import ThemeController from "@/components/navbar/ThemeController.vue";

const router = useRouter();

</script>

<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl" @click="router.push('/')">Monkey memory</a>
    </div>
    <div class="flex-none">
<!--      <LangDropdown/>-->
      <ThemeController/>
    </div>
  </div>
</template>

<style scoped>

</style>
