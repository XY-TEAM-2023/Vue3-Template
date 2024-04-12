<template>
  <el-card ref="cardRef" :class="{ 'fs-card-fold': model }" :shadow="props.shadow">
    <template #header v-if="$slots.header">
      <div @click="onClickTile" ref="refHeader" style="width: 100%; display: flex; align-items: center">
        <div v-if="props.useFold" style="margin-right: 4px; display: flex; align-items: center">
          <el-icon v-if="model">
            <Plus />
          </el-icon>
          <el-icon v-if="!model">
            <Minus />
          </el-icon>
        </div>

        <slot name="header"></slot>
      </div>
    </template>

    <slot name="default" v-if="!model"></slot>

    <template #footer v-if="$slots.footer && !model">
      <div style="display: flex; flex-direction: row; align-items: center">
        <slot name="footer"></slot>
      </div>
    </template>
  </el-card>
</template>

<script setup>
import { defineProps, ref, defineEmits } from 'vue'
import { Minus, Plus } from '@element-plus/icons-vue'

const model = defineModel({
  data() {
    return false
  },
})
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
  /** 默认为折叠状态 */
  defaultFold: {
    type: Boolean,
    default: false,
  },
})

// const isFold = ref(props.defaultFold)
const cardRef = ref(null)
const refHeader = ref(null)

const emits = defineEmits(['changeFold'])

function onClickTile() {
  if (!props.useFold) {
    return
  }

  model.value = !model.value
  emits('changeFold', model.value)
}

function getContentAreaHeight() {
  let height = cardRef.value.$el.clientHeight
  height -= refHeader.value.clientHeight // 减去header
  height -= 20 //减去padding
  return height
}

/** 设置为折叠状态 */
function setFold() {
  model.value = true
}

/** 设置为展开状态 */
function setExpand() {
  model.value = false
}

defineExpose({
  setFold,
  setExpand,
  getContentAreaHeight,
})
</script>

<style scoped lang="scss">
.fs-card-fold {
  :deep(.el-card__body) {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
}
</style>
