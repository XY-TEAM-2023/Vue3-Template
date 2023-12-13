<template>
  <div v-if="config.logo.display" class="ui-logo unselect">
    <img src="/favicon.ico" alt="logo" class="icon" />
    <!-- 使用计算属性来显示标题 -->
    <div class="text unselect">{{ appStore.logoLabel }}</div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import { useAppStore } from '@/stores/app'
import { config } from '@/config'

const props = defineProps({
  title: String,
  value: String,
})

const appStore = useAppStore()

const emit = defineEmits(['update:value', 'custom-event'])

const inputValue = ref(props.value)

const display = computed(() => '计算后的标题: ' + props.title)

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

<style scoped lang="scss">
/* 组件样式 */

.ui-logo {
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-left: 20px;
  //border-right: solid 1px var(--el-menu-border-color);

  .icon {
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }
  .text {
    color: #fffff5db;
    font-size: 16px;
    font-weight: 600;
  }
}
</style>
