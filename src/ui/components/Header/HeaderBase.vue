<template>
  <el-dropdown trigger="hover" :show-timeout="10" :class="{ 'disable-mouse-events': !props.canHover }">
    <template #default>
      <div
        class="info"
        :class="{ 'info-hover': isHover && props.canHover }"
        :style="widthStyle"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
      >
        <slot></slot>
        <el-icon v-if="canHover" class="arrow">
          <ArrowUp v-if="isHover" />
          <ArrowDown v-else />
        </el-icon>
      </div>
    </template>

    <template #dropdown>
      <el-dropdown-menu class="unselect">
        <slot name="dropdown"></slot>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed, defineProps, ref } from 'vue'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'

const props = defineProps({
  width: String,
  canHover: Boolean,
})
const isHover = ref(false)

const widthStyle = computed(() => {
  if (!props.width) {
    return {}
  }
  return {
    width: props.width + 'px',
  }
})
</script>

<style scoped lang="scss">
.info {
  display: flex;
  flex-direction: row;
  align-items: center; /* 垂直居中对齐 */
  color: #3d6e8f;
  gap: 6px;
  height: 40px;
  padding: 5px 10px;
  font-weight: 700;
  //font-family: Roboto;
  //border: 1px solid #ccc; /* 为了可视化效果添加的边框 */
}

.info-hover {
  cursor: pointer;
  border-radius: 5px;
  background-color: #e5f4ff;
  color: #1b9cfb;
}

.arrow {
  margin-left: auto;
}

.disable-mouse-events {
  pointer-events: none;
}
</style>
