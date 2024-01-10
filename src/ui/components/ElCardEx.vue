<template>
  <div>
    <el-card class="el-card-fs" :class="{ 'fs-card-fold': isFold }" :shadow="props.shadow">
      <template #header v-if="$slots.header">
        <div @click="onClickTile" style="width: 100%; display: flex; align-items: center">
          <div v-if="props.useFold" style="margin-right: 4px; display: flex; align-items: center">
            <el-icon v-if="isFold">
              <Plus />
            </el-icon>
            <el-icon v-if="!isFold">
              <Minus />
            </el-icon>
          </div>

          <slot name="header"></slot>
        </div>
      </template>

      <slot name="default" v-if="!isFold"></slot>

      <template #footer v-if="$slots.footer && !isFold">
        <slot name="footer"></slot>
      </template>
    </el-card>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { Minus, Plus } from '@element-plus/icons-vue'

const isFold = ref(false)
const props = defineProps({
  /** 是否启用折叠功能 */
  useFold: {
    type: Boolean,
    default: true,
  },
  /** 是否显示阴影， "always" | "never" | "hover" */
  shadow: {
    type: String,
    default: 'always',
  },
})

function onClickTile() {
  console.log('>>>>>>>>>>>>>>', props.useFold, isFold.value)
  if (!props.useFold) {
    return
  }

  isFold.value = !isFold.value
}
</script>

<style scoped lang="scss">
.fs-card-fold {
  :deep(.el-card__body) {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
}
</style>
