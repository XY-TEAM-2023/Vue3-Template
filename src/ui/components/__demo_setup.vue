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
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'

/** 作为组件时，外部传参 */
const props = defineProps({
  title: String,
  value: String,
})

/** 用户全局数据对象 */
const userStore = useUserStore()
/** 应用全局数据对象 */
const appStore = useAppStore()

/** 作为子组件时，定义有什么事件 */
const emit = defineEmits(['update:value', 'custom-event'])

/** 定义一个用于在Template中显示的变量 */
const inputValue = ref(props.value)

/** 定义一个将数据处理后返回结果的变量 */
const computedTitle = computed(() => '计算后的标题: ' + props.title)

/** 用于父组件如果更新了传入参数的值，同步更新组件内的数据 */
watch(
  () => props.value,
  (newValue) => {
    inputValue.value = newValue
  }
)

/** 定义一个时间 */
const onInput = (event) => {
  inputValue.value = event.target.value
}

/** 触发外部事件 */
const emitCustomEvent = () => {
  emit('custom-event', { msg: '这是自定义事件的数据' })
}

/** 组件加载事件 */
onMounted(() => {
  console.log('组件已挂载')
})

/** 组件卸载事件 */
onBeforeUnmount(() => {
  console.log('组件销毁之前')
})
</script>

<style scoped lang="scss">
/* 组件样式 */
//$xxxx = 'test';
</style>
