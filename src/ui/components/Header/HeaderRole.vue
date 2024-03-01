<template>
  <header-base :can-hover="false">
    <template #default>
      <ui-svg :svg-code="svg" svg-color="#3d6e8f" size="22" />
      {{ userStore.role_name }}
    </template>
  </header-base>
</template>

<script setup>
import UiSvg from '@/ui/components/UiSvg.vue'
import HeaderBase from './HeaderBase.vue'
import { useUserStore } from '@/stores/user'

const svg =
  '<svg t="1709215384607" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="146985" width="200" height="200"><path d="M858.7 360.5l-132.2-132c-8.5-15.8-25-25.7-43-25.6h-71.3l-5 2.8c-26.4 14.7-60.1 22.7-94.9 22.7h-0.6c-34.8 0-68.4-8-94.9-22.7l-5-2.8h-71.3c-18-0.1-34.5 9.8-43 25.6l-132 132c-9.1 9-14.2 21.3-14.2 34.2 0 12.9 5.1 25 14.2 34.1l96.6 96.5c8.1 8 18.5 12.9 29.8 13.9v233.2c0 26.9 21.9 48.7 48.8 48.7h342.8c26.9 0 48.8-21.9 48.8-48.7V539.2c11.3-1 21.7-5.9 29.8-13.9l96.6-96.5c9.1-9.1 14.2-21.2 14.2-34.1 0-12.8-5.1-25.1-14.2-34.2z" p-id="146986"></path></svg>'

const userStore = useUserStore()
</script>

<style scoped lang="scss">
.txt {
  //margin-left: 4px;
}
</style>
