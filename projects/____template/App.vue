<template>
  <div class="body">

  </div>
</template>

<script setup>
// ElementPlus 的国际化配置
import {computed, onMounted} from 'vue'
import {useAppStore} from '@/stores/app'

const appStore = useAppStore()

</script>

<style>

.body {
  width: 100%;
  height: 100%;
  padding: 2px 10px 10px 10px;
  background-color: rgb(241, 241, 241);
  display: flex;
  flex-direction: column;
  font-size: 14px;
}


</style>
