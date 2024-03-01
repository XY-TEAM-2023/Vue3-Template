<template>
  <div class="toolbar">
    <!--  Router菜单快捷及  -->
    <div class="toolbar-router">
      <el-icon class="toolbar-router-btn" @click="onBtnLastPage">
        <ArrowLeft />
      </el-icon>
      <el-icon class="toolbar-router-btn" @click="onBtnRefresh">
        <RefreshRight />
      </el-icon>
      <el-icon class="toolbar-router-btn" @click="onBtnHome">
        <HomeFilled />
      </el-icon>
    </div>

    <div class="divider" />

    <div ref="scrollContainer" class="scroll-container">
      <div class="scroll-content" :style="{ transform: `translateX(${scrollX}px)` }">
        <ui-opened-tag
          v-for="(item, index) in openedTabs"
          v-menu="onTabMenu(item, index)"
          :key="index"
          :text="getTitle(item)"
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
import { ref, computed, onMounted, nextTick, reactive } from 'vue'
import { useAppStore } from '@/stores/app'
import { ArrowLeft, HomeFilled, RefreshRight } from '@element-plus/icons-vue'
import router from '@/router'
import UiOpenedTag from '@/ui/components/UiOpenedTag.vue'

/** 应用全局数据对象 */
const appStore = useAppStore()
// 移除异常的Tab
appStore.openedTabs = appStore.openedTabs.filter((tab) => tab.name && tab.name.trim() !== '')
const openedTabs = computed(() => {
  return appStore.openedTabs
})

function onBtnLastPage() {
  router.back()
}

function getTitle(obj) {
  if (!obj.title) {
    console.error('没有找到title', obj)
    return 'unknown'
  } else if (typeof obj.title === 'string') {
    return obj.title
  }

  return obj.title[appStore.language]
}

function onCloseTab(fullPath) {
  // console.log('>>>>>>>>>> ', fullPath)
  let removeIndex = -1
  for (let i = 0; i < appStore.openedTabs.length; i++) {
    const tab = appStore.openedTabs[i]
    if (tab.fullPath === fullPath) {
      removeIndex = i
      break
    }
  }

  // console.log('removeIndex', removeIndex)
  if (removeIndex < 0) {
    return
  }
  appStore.openedTabs.splice(removeIndex, 1)

  // 关掉的不是正在显示的页面
  // console.log('fullPath !== appStore.routerPath', fullPath !== appStore.routerPath)
  if (fullPath !== appStore.routerPath) {
    return
  }

  // 当前没有已打开的Tab, 显示首页
  // console.log('appStore.openedTabs.length', appStore.openedTabs.length)
  if (appStore.openedTabs.length === 0) {
    router.push('/')
    return
  }

  // 关掉的是最后一个tab
  if (removeIndex === appStore.openedTabs.length) {
    removeIndex -= 1
  }
  // console.log('appStore.openedTabs[removeIndex].fullPat', appStore.openedTabs[removeIndex].fullPat)
  router.push(appStore.openedTabs[removeIndex].fullPath)
}

function onChangeTab(fullPath) {
  router.push(fullPath)
}

function onBtnRefresh() {
  router.refreshCurPage()
}

function onBtnHome() {
  router.push('/')
}

// 鼠标滚轮让tabs滑动
const scrollContainer = ref(null)
const scrollX = ref(0)
onMounted(async () => {
  await nextTick() // 等待DOM更新
  const container = scrollContainer.value
  if (container) {
    container.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault()
        scrollX.value += e.deltaY
        if (scrollX.value > 0) {
          scrollX.value = 0
        } else if (scrollX.value < -container.scrollWidth) {
          scrollX.value = -container.scrollWidth
        }
        console.log(container.scrollWidth, container.clientWidth)
      },
      { passive: true }
    )
    container.style.willChange = 'transform' // 告诉浏览器元素可能会被滚动
  }
})

function onTabMenu(t_data, t_index) {
  const data = t_data
  const index = t_index
  return reactive([
    // 关闭当前
    {
      // 关闭当前
      display: true,
      text: 'tabs.close',
      icon: 'CloseBold',
      action: () => {
        onCloseTab(data.fullPath)
      },
    },
    // 关闭左侧
    {
      // 是否禁用
      disabled: index === 0,
      text: 'tabs.closeLeft',
      icon: '<svg t="1708505548092" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4524" width="200" height="200"><path d="M935.424 562.688c5.632-5.632 8.704-13.312 8.192-20.992V482.816c0.512-15.872-11.776-29.184-27.648-29.696h-378.88c-7.168 1.024-14.336-3.072-17.408-9.728-3.072-7.68-1.536-16.896 4.608-22.528l111.104-111.104c11.264-13.312 10.752-33.792-1.536-46.592l-41.984-41.984c-12.288-10.24-30.72-8.192-40.96 4.096L282.112 494.08c-10.24 9.216-11.264 24.576-2.048 34.816 1.024 1.024 2.048 2.048 3.584 3.072l267.776 267.776c12.288 12.288 31.744 13.312 45.056 3.072l40.448-40.448c10.752-13.824 10.24-33.28-1.536-46.592L523.776 604.16c-7.68-6.656-8.192-18.432-1.536-26.112 3.584-4.096 8.704-6.144 13.824-6.144h377.344c8.704 0 15.872-3.072 22.016-9.216zM91.648 943.616H189.44c6.144 0 11.776-5.12 11.776-11.776V91.648c0-6.144-5.12-11.776-11.776-11.776H91.648c-6.144 0-11.776 5.12-11.776 11.776V931.84c0 6.656 5.632 11.776 11.776 11.776z" p-id="4525"></path></svg>',
      action: () => {
        const tabs = []
        for (let i = 0; i < index; i++) {
          tabs.push(appStore.openedTabs[i].fullPath)
        }
        tabs.forEach((fullPath) => {
          onCloseTab(fullPath)
        })
      },
    },
    // 关闭右侧
    {
      text: 'tabs.closeRight',
      disabled: index === appStore.openedTabs.length - 1,
      icon: '<svg t="1708505617141" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5772" width="200" height="200"><path d="M88.576 562.688c-5.632-5.632-8.704-13.312-8.192-20.992V482.816c-0.512-15.872 11.776-29.184 27.648-29.696h378.88c7.168 1.024 14.336-3.072 17.408-9.728 3.072-7.68 1.536-16.896-4.608-22.528L388.608 309.76c-11.264-13.312-10.752-33.792 1.536-46.592l41.984-41.984c12.288-10.24 30.72-8.192 40.96 4.096l268.8 268.8c10.24 9.216 11.264 24.576 2.048 34.816-1.024 1.024-2.048 2.048-3.584 3.072l-267.776 267.776c-12.288 12.288-31.744 13.312-45.056 3.072l-40.448-40.448c-10.752-13.824-10.24-33.28 1.536-46.592L500.224 604.16c7.68-6.656 8.192-18.432 1.536-26.112-3.584-4.096-8.704-6.144-13.824-6.144H110.08c-8.192 0-15.36-3.072-21.504-9.216zM932.352 943.616H834.56c-6.144 0-11.776-5.12-11.776-11.776V91.648c0-6.144 5.12-11.776 11.776-11.776h97.792c6.144 0 11.776 5.12 11.776 11.776V931.84c0 6.656-5.632 11.776-11.776 11.776z" p-id="5773"></path></svg>',
      action: () => {
        const tabs = []
        for (let i = index + 1; i < appStore.openedTabs.length; i++) {
          tabs.push(appStore.openedTabs[i].fullPath)
        }
        tabs.forEach((fullPath) => {
          onCloseTab(fullPath)
        })
      },
    },
    // 关闭其他
    {
      text: 'tabs.closeOther',
      disabled: appStore.openedTabs.length <= 1,
      icon: '<svg t="1708505721130" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8817" width="200" height="200"><path d="M512 428.544L677.376 256 768 328.32 592 512 768 695.68 677.376 768 512 595.456 346.624 768 256 695.68 432 512 256 328.32 346.624 256 512 428.544zM0 384V127.616C0 57.152 57.28 0 127.616 0H384v128H128v256H0z m0 256h128v256h256v128H127.616A127.68 127.68 0 0 1 0 896.384V640z m1024-256h-128V128h-256V0h256.384C966.848 0 1024 57.28 1024 127.616V384z m0 256v256.384A127.68 127.68 0 0 1 896.384 1024H640v-128h256v-256h128z" fill="#838B88" p-id="8818"></path></svg>',
      action: () => {
        const tabs = []
        for (let i = appStore.openedTabs.length - 1; i >= 0; i--) {
          if (i !== index) {
            tabs.push(appStore.openedTabs[i].fullPath)
          }
        }
        tabs.forEach((fullPath) => {
          onCloseTab(fullPath)
        })
      },
    },
    // 关闭所有
    {
      text: 'tabs.closeAll',
      icon: '<svg t="1708505706595" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7848" width="200" height="200"><path d="M40.960024 0.000026h788.47996a10.270719 10.270719 0 0 1 10.24 10.239999v71.679997a10.270719 10.270719 0 0 1-10.24 10.239999H92.160021v737.279963a10.269439 10.269439 0 0 1-10.239999 10.24H10.240025a10.269439 10.269439 0 0 1-10.239999-10.24V40.960024A40.916478 40.916478 0 0 1 40.960024 0.000026z" p-id="7849"></path><path d="M983.039976 163.840017H204.800015a40.916478 40.916478 0 0 0-40.959998 40.959998v778.239961a40.916478 40.916478 0 0 0 40.959998 40.959998h778.239961a40.916478 40.916478 0 0 0 40.959998-40.959998V204.800015a40.916478 40.916478 0 0 0-40.959998-40.959998z m-51.199997 767.999962H256.000013V256.000013h675.839966z" p-id="7850"></path><path d="M414.813445 773.119987h66.591997a18.440959 18.440959 0 0 0 13.905919-6.42432l98.136315-116.648954 98.136315 116.648954A18.090239 18.090239 0 0 0 705.49119 773.119987h66.591997a8.96 8.96 0 0 0 6.89664-14.764799L640.707834 593.919996l138.384633-164.435192A8.96 8.96 0 0 0 772.195827 414.720005h-66.591997a18.442239 18.442239 0 0 0-13.905919 6.42432l-98.248955 116.648954-98.136315-116.648954A18.091519 18.091519 0 0 0 481.406722 414.720005h-66.593277a8.96 8.96 0 0 0-6.89664 14.764799L546.186238 593.919996 407.916805 758.355188A8.96 8.96 0 0 0 414.813445 773.119987z" p-id="7851"></path></svg>',
      action: () => {
        const tabs = []
        let curTab = ''
        for (let i = appStore.openedTabs.length - 1; i >= 0; i--) {
          if (i !== index) {
            tabs.push(appStore.openedTabs[i].fullPath)
          } else {
            curTab = tabs.push(appStore.openedTabs[i].fullPath)
          }
        }
        tabs.push(curTab)

        tabs.forEach((fullPath) => {
          onCloseTab(fullPath)
        })
      },
    },
  ])
}
</script>

<style scoped lang="scss">
/* 组件样式 */

// 背景色
$toolbar-bg-color: #eff0f4;

.toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 50px;
  min-height: 50px;
  max-height: 50px;
  background-color: $toolbar-bg-color;
}

.toolbar-router {
  display: flex;
  background-color: #fff;
  height: 30px;
  border-radius: 6px;
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

.divider {
  height: 20px;
  border-right: 2px solid #e7e7e7; /* 竖线样式 */
  margin-right: 10px;
  margin-left: 10px;
}
</style>
