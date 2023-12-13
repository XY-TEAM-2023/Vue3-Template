<template>
  <div class="about flex-center">
    <h1>This is an about page, random value: {{ randomValue }}</h1>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const randomValue = computed(() => {
  return Math.random()
})
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
