<template>
  <div ref="tagBox" class="tag-box" :class="{ 'tag-box-active': isSelect }" @click="onClick">
    <span class="tag-text unselect">{{ text }}</span>

    <div v-if="closable" class="tag-icon" @click="onClose">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  closable: {
    type: Boolean,
    default: false,
  },
  isSelect: {
    type: Boolean,
    default: false,
  },
})
const text = ref(props.text)
const closable = ref(props.closable)
const isSelect = ref(props.isSelect)
watch(
  () => [props.text, props.closable, props.isSelect],
  ([newText, newClosable, newIsSelect], [oldText, oldClosable, oldIsSelect]) => {
    if (newText !== oldText) {
      text.value = newText
    }
    if (newClosable !== oldClosable) {
      closable.value = newClosable
    }
    if (newIsSelect !== oldIsSelect) {
      isSelect.value = newIsSelect
    }
  },
  { deep: true }
)

/** 作为子组件时，定义有什么事件 */
const emit = defineEmits(['close', 'click'])

function onClose(event) {
  event.stopPropagation()
  // console.log('关闭', props.closable)

  if (props.closable) {
    emit('close')
  }
}

function onClick() {
  console.log('点击')
  emit('click')
}
</script>

<style scoped lang="scss">
.tag-box {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  height: 30px;
  padding: 0 10px;
  background-color: #fff;
  font-size: 12px;
  color: #909399;
  min-width: 0; /* 允许元素宽度小于其内容的自然大小 */
  flex-shrink: 0; /* 防止元素缩 */
  cursor: pointer;
}

.tag-box:hover {
  background-color: #eee;
  color: #909399;

  .tag-icon {
    width: 1em;
    opacity: 1;
    margin-left: 6px;
    color: #f56c6c;
  }
}

.tag-box-active {
  background-color: #4165d7 !important;
  color: #ffffff !important;
}

.tag-box:not(:last-child) {
  margin-right: 10px;
}

.tag-text {
  padding-top: 2px;
}

.tag-icon {
  --color: #333;
  height: 1em;
  width: 0;
  line-height: 1em;
  opacity: 0;
  transition: all 0.3s;
}

.tag-icon:hover {
  fill: red;
}
</style>
