<script setup>
import { computed } from 'vue'
import { useDark } from '@vueuse/core'

const isDark = useDark({
  storageKey: 'vitepress-theme-appearance',
})

const randomValue = computed(() => {
  return Math.random()
})
</script>

<template>
  <div class="about flex-center">
    <h1>This is an about page, random value: {{ randomValue }}</h1>
    <el-button @click="isDark = !isDark"> 切换模式</el-button>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
