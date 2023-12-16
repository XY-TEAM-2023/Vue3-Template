<template>
  <div class="toolbar">
    <!--  Router菜单快捷及  -->
    <div class="toolbar-router">
      <el-icon class="toolbar-router-btn" @click="onBtnLastPage"><ArrowLeft /></el-icon>
      <el-icon class="toolbar-router-btn" @click="onBtnRefresh"><RefreshRight /></el-icon>
      <el-icon class="toolbar-router-btn" @click="onBtnHome"><HomeFilled /></el-icon>
    </div>

    <div ref="scrollContainer" class="scroll-container">
      <div class="scroll-content" :style="{ transform: `translateX(${scrollX}px)` }">
        <ui-opened-tag
          v-for="(item, index) in appStore.openedTabs"
          :key="index"
          :text="item.title"
          :is-select="item.fullPath === appStore.routerPath"
          :closable="true"
          @click="onChangeTab(item.fullPath)"
          @close="onCloseTab(item.fullPath)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount, defineProps, defineEmits } from 'vue'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { ArrowLeft, HomeFilled, RefreshRight } from '@element-plus/icons-vue'
import router from '@/router'
import { config } from '@/config'
import UiOpenedTag from '@/ui/components/UiOpenedTag.vue'

/** 应用全局数据对象 */
const appStore = useAppStore()
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
  router.refreshCurPage()
}

function onBtnHome() {
  router.push(config.router.homePage)
}

// 鼠标滚轮让tabs滑动
const scrollContainer = ref(null)
const scrollX = ref(0)
onMounted(async () => {
  await nextTick() // 等待DOM更新
  const container = scrollContainer.value
  if (container) {
    container.addEventListener('wheel', (e) => {
      e.preventDefault()
      scrollX.value += e.deltaY
      if (scrollX.value > 0) {
        scrollX.value = 0
      } else if (scrollX.value < -container.scrollWidth) {
        scrollX.value = -container.scrollWidth
      }
      console.log(container.scrollWidth, container.clientWidth)
    })
    container.style.willChange = 'transform' // 告诉浏览器元素可能会被滚动
  }
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

///////////////////////////////////////

.scroll-container {
  width: 100%;
  overflow: hidden;
  white-space: nowrap; /* 内容不换行 */
}

.scroll-content {
  display: flex;
  flex-direction: row;
  transition: all 0.3s;
}

/* 鼠标悬停时允许水平滚动 */
.scroll-container:hover {
  overflow-x: auto;
}

/* 鼠标悬停时隐藏滚动条 */
.scroll-container::-webkit-scrollbar {
  width: 0;
  height: 0;
}

/* 鼠标悬停时禁用滚动条 */
.scroll-container::-webkit-scrollbar-thumb {
  background-color: transparent;
}

/* 鼠标悬停时禁用滚动条 */
.scroll-container::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
