<script setup>

import {useRoute, useRouter} from "vue-router";
import ThemeController from "@/components/navbar/ThemeController.vue";
import {store} from "@/store/store";
import {computed} from "vue";

const router = useRouter();
const route = useRoute();

const title = computed(() => {
  if (route.name === 'settings') {
    return 'Settings'
  }
  if (store.state.global.showHint && route.name === 'game') {
    return "Click '1'"
  }
  return 'Monkey Memory'
})

const wrenchClicked = () => {
  if (route.name === 'settings') {
    router.push('/')
  } else {
    router.push('/settings')
  }
}

</script>

<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl" @click="router.push('/')">
        {{title}}
      </a>
    </div>
    <div class="flex-none">
<!--      <LangDropdown/>-->
      <i class="px-3 bi bi-wrench cursor-pointer" @click="wrenchClicked"></i>
      <ThemeController/>
    </div>
  </div>
</template>
