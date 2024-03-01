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
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  defineProps,
  defineEmits,
  useAttrs,
  defineExpose,
  getCurrentInstance,
} from 'vue'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'

/** 用户全局数据对象 */
const userStore = useUserStore()
/** 应用全局数据对象 */
const appStore = useAppStore()

const inputValue = ref(props.modeValue)
const props = defineProps({
  /* v-module */
  modeValue: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  closable: {
    type: Boolean,
    default: false,
  },
})

/** 获取所有绑定的参数和时间 */
const instance = getCurrentInstance()
console.log(instance.vnode.props)

const { text, closable } = props
/* 实现外部修改了变量，内部同步变化 */
watch(
  () => [props.text, props.closable],
  ([newText, newClosable], [oldText, oldClosable]) => {
    console.log(newText, newClosable)
    if (newText !== oldText) {
      text.value = newText
    }
    if (newClosable !== oldClosable) {
      closable.value = newClosable
    }
  },
  { deep: true }
)

/** 作为子组件时，定义有什么事件 */
const emit = defineEmits(['update:modelValue', 'custom-event'])

/** 触发外部事件 */
const emitCustomEvent = () => {
  emit('custom-event', { msg: '这是自定义事件的数据' })
}

/** 定义一个将数据处理后返回结果的变量 */
const computedTitle = computed(() => '计算后的标题: ' + props.title)

/** 定义一个时间 */
const onInput = (event) => {
  inputValue.value = event.target.value
  emit('update:modelValue', inputValue.value)
}

/** 组件加载事件 */
onMounted(() => {
  console.log('组件已挂载')
})

/** 组件卸载事件 */
onBeforeUnmount(() => {
  console.log('组件销毁之前')
})

function test() {
  console.log('11111')
}

// 使用 defineExpose 暴露方法
defineExpose({ test })
</script>

<style scoped lang="scss">
/* 组件样式 */
//$xxxx = 'test';
</style>
