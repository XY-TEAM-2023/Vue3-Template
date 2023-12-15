<template>
  <div class="toolbar">
    <!--  Router菜单快捷及  -->
    <div class="toolbar-router">
      <el-icon class="toolbar-router-btn" @click="onBtnLastPage"><ArrowLeft /></el-icon>
      <el-icon class="toolbar-router-btn" @click="onBtnRefresh"><RefreshRight /></el-icon>
      <el-icon class="toolbar-router-btn" @click="onBtnHome"><HomeFilled /></el-icon>
    </div>

    <!--  已打开的页面  -->
    <ui-opened-tag
      v-for="(item, index) in appStore.openedTabs"
      :key="index"
      :text="item.title"
      :is-select="item.fullPath === appStore.routerPath"
      :closable="true"
      @click="onChangeTab(item.fullPath)"
      @close="onCloseTab(item.fullPath)"
    ></ui-opened-tag>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { ArrowLeft, HomeFilled, RefreshRight } from '@element-plus/icons-vue'
import router from '@/router'
import { config } from '@/config'
import UiOpenedTag from '@/ui/components/UiOpenedTag.vue'

function onBtnLastPage() {
  router.back()
}

function onCloseTab(fullPath) {
  console.log('>>>>>>>>>> ', fullPath)
  let removeIndex = -1
  for (let i = 0; i < appStore.openedTabs.length; i++) {
    const tab = appStore.openedTabs[i]
    if (tab.fullPath === fullPath) {
      removeIndex = i
      break
    }
  }

  console.log('removeIndex', removeIndex)
  if (removeIndex < 0) {
    return
  }
  appStore.openedTabs.splice(removeIndex, 1)

  // 关掉的不是正在显示的页面
  console.log('fullPath !== appStore.routerPath', fullPath !== appStore.routerPath)
  if (fullPath !== appStore.routerPath) {
    return
  }

  // 当前没有已打开的Tab, 显示首页
  console.log('appStore.openedTabs.length', appStore.openedTabs.length)
  if (appStore.openedTabs.length === 0) {
    router.push(config.router.homePage)
    return
  }

  // 关掉的是最后一个tab
  console.log('removeIndex + 1 === appStore.openedTabs.length', removeIndex + 1 === appStore.openedTabs.length)
  if (removeIndex === appStore.openedTabs.length) {
    removeIndex -= 1
  }
  console.log('appStore.openedTabs[removeIndex].fullPat', appStore.openedTabs[removeIndex].fullPat)
  router.push(appStore.openedTabs[removeIndex].fullPath)
}

function onChangeTab(fullPath) {
  router.push(fullPath)
}

function onBtnRefresh() {
  test.value = 'aaaa'
  // router.refreshCurPage()
}

function onBtnHome() {
  router.push(config.router.homePage)
}

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

// 背景色
$toolbar-bg-color: #f5f5f5;

.toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 10px;
  width: 100%;
  height: 50px;
  background-color: $toolbar-bg-color;
}

.toolbar-router {
  display: flex;
  background-color: #fff;
  height: 30px;
  border-radius: 4px;
  margin-right: 20px;
  list-style: none;
}

.toolbar-router-btn {
  width: 30px;
  height: 100%;
  color: #333;
  cursor: pointer;
  font-weight: 700;
}
.toolbar-router-btn:hover {
  color: #42bb85;
}
// 分割竖线
.toolbar-router-btn:not(:last-child):after {
  display: block;
  content: '';
  position: absolute;
  right: 0;
  top: calc(50% - 5px);
  height: 10px;
  width: 1px;
  background-color: #eee;
}
</style>
