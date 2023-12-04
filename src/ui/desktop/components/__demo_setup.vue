<template>
  <div>
    <!-- 使用计算属性来显示标题 -->
    <h3>{{ computedTitle }}</h3>

    <!-- 数据双向绑定的输入框 -->
    <input v-model="inputValue" @input="onInput" />

    <!-- 按钮用于触发方法 -->
    <button @click="emitCustomEvent">触发自定义事件</button>

    <!-- 插槽用于从父组件插入内容 -->
    <slot name="additional-content"></slot>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'

const props = defineProps({
  title: String,
  value: String,
})

const emit = defineEmits(['update:value', 'custom-event'])

const inputValue = ref(props.value)

const computedTitle = computed(() => '计算后的标题: ' + props.title)

watch(
  () => props.value,
  (newValue) => {
    inputValue.value = newValue
  }
)

const onInput = (event) => {
  inputValue.value = event.target.value
  emit('update:value', inputValue.value)
}

const emitCustomEvent = () => {
  emit('custom-event', { msg: '这是自定义事件的数据' })
}

onMounted(() => {
  console.log('组件已挂载')
})

onBeforeUnmount(() => {
  console.log('组件销毁之前')
})
</script>

<style scoped>
/* 组件样式 */
</style>