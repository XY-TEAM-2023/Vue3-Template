<template>
  <header-base width="72" can-hover>
    <template #default>
      <el-image v-if="appStore.language === 'ko'" fit="contain" :src="kr" class="img" />
      <el-image v-if="appStore.language === 'en'" fit="contain" :src="en" class="img" />
      <el-image v-if="appStore.language === 'zh'" fit="contain" :src="zh" class="img" />
    </template>

    <template #dropdown>
      <el-dropdown-item v-if="appStore.language !== 'ko'" @click="appStore.setLanguage('ko')">
        <el-image :src="kr" class="img" fit="contain" />
        <span class="txt">Ko</span>
      </el-dropdown-item>
      <el-dropdown-item v-if="appStore.language !== 'en'" @click="appStore.setLanguage('en')">
        <el-image :src="en" class="img" fit="contain" />
        <span class="txt">En</span>
      </el-dropdown-item>
      <el-dropdown-item v-if="appStore.language !== 'zh'" @click="appStore.setLanguage('zh')">
        <el-image :src="zh" class="img" fit="contain" />
        <span class="txt">Zh</span>
      </el-dropdown-item>
    </template>
  </header-base>
</template>

<script setup>
import HeaderBase from '@/ui/components/Header/HeaderBase.vue'
import kr from '@/assets/images/kr.png' // 导入本地 PNG 图片
import en from '@/assets/images/en.png' // 导入本地 PNG 图片
import zh from '@/assets/images/zh.png'
import { useAppStore } from '@/stores/app' // 导入本地 PNG 图片

const appStore = useAppStore()
</script>

<style scoped lang="scss">
.img {
  width: 22px;
  height: 22px;
}

.txt {
  margin-left: 12px;
}
</style>
