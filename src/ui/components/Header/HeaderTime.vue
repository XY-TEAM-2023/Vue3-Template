<template>
  <header-base :can-hover="false">
    <template #default>
      <ui-svg :svg-code="svg" svg-color="#3d6e8f" size="18" />
      {{ currentTime }}
    </template>
  </header-base>
</template>

<script setup>
import UiSvg from '@/ui/components/UiSvg.vue'
import HeaderBase from './HeaderBase.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { tsToTimezoneDate } from '@/utils/timeUtil'

const svg =
  '<svg t="1709212177301" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="102581" width="200" height="200"><path d="M511.488 0C228.864 0 0 229.376 0 512s228.864 512 511.488 512C794.624 1024 1024 794.624 1024 512s-229.376-512-512.512-512z m21.76 556.416V219.52H438.912v392.32h1.472l243.84 140.8 47.296-81.728-198.144-114.432-0.128-0.064zM512 921.6A409.472 409.472 0 0 1 102.4 512c0-226.304 183.296-409.6 409.6-409.6 226.304 0 409.6 183.296 409.6 409.6 0 226.304-183.296 409.6-409.6 409.6z" fill="#0B0D24" p-id="102582"></path></svg>'

const currentTime = ref('')
let timer

// 在组件挂载时启动定时器
onMounted(() => {
  // 更新当前时间
  updateCurrentTime()

  // 每隔一秒更新一次当前时间
  timer = setInterval(updateCurrentTime, 1000)
})

// 在组件销毁时清除定时器
onUnmounted(() => {
  clearInterval(timer)
})

// 更新当前时间
function updateCurrentTime() {
  const now = tsToTimezoneDate(new Date().getTime())
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}:${seconds}`
}
</script>

<style scoped lang="scss"></style>
