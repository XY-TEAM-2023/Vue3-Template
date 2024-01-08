<template>
  <nav class="bottom-nav">
    <div class="arrow left-arrow" v-if="showLeftArrow" @click="scrollLeft">&lsaquo;</div>
    <div class="scroll-container" ref="scrollContainer" @scroll="checkScroll">
      <template v-for="(route, index) in layoutRoutes" :key="index">
        <ui-navigation-item-mobile :route="route" />
      </template>
    </div>
    <div class="arrow right-arrow" v-if="showRightArrow" @click="scrollRight">&rsaquo;</div>
  </nav>
</template>

<script setup>
import router from '@/router'
import { ref, onMounted, computed } from 'vue'
import UiNavigationItemMobile from './UiNavigationItemMobile.vue'

const showLeftArrow = ref(false)
const showRightArrow = ref(false)
onMounted(() => {
  checkScroll()
})

const scrollContainer = ref(null)

onMounted(() => {
  const container = document.querySelector('.scroll-container')
  // 检查内容是否超出容器
  if (container.scrollWidth > container.clientWidth) {
    container.style.justifyContent = 'flex-start'
  }
})

function checkScroll() {
  const container = scrollContainer.value
  showLeftArrow.value = container.scrollLeft > 30
  showRightArrow.value = container.scrollLeft + 30 < container.scrollWidth - container.clientWidth
}
function scrollLeft() {
  const container = scrollContainer.value
  container.scrollBy({ left: -container.clientWidth, behavior: 'smooth' })
}
function scrollRight() {
  const container = scrollContainer.value
  container.scrollBy({ left: container.clientWidth, behavior: 'smooth' })
}

const layoutRoutes = computed(() => {
  const routes = router.config.find((obj) => obj.fullPath === '/')
  return routes.children
})
</script>
<style scoped>
.bottom-nav {
  width: 100%;
  height: 100%;
  padding-top: 6px;
  position: relative; /* 确保箭头能够相对于此元素定位 */
  align-items: center;
  background-color: #333;
}

.scroll-container {
  display: flex;
  z-index: 1; /* 低于箭头的 z-index */
  overflow-x: scroll; /* 始终显示水平滚动条 */
  height: 100%;
  align-items: center;
  justify-content: space-around; /* 水平方向对齐 */
  -webkit-overflow-scrolling: touch; /* iOS Safari 惯性滚动 */
}

/* 针对 Webkit 浏览器的滚动条样式 */
.scroll-container::-webkit-scrollbar {
  -webkit-appearance: none;
  height: 6px; /* 滚动条高度 */
}

.scroll-container::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5); /* 滚动条颜色 */
}

/* 针对 Firefox 浏览器的滚动条样式 */
.scroll-container {
  scrollbar-width: auto; /* “auto” 或 “thin” */
  scrollbar-color: rgba(0, 0, 0, 0.5) #ffffff; /* 滚动条颜色和轨道颜色 */
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #181818;
  height: 100%;
  cursor: pointer;
  color: white;
  z-index: 10;
  display: flex;
  align-items: center;
  padding-left: 4px;
  padding-right: 4px;
  font-size: large;
  font-weight: bold;
  background-color: rgba(24, 24, 24, 0.6); /* 设置背景色为半透明 */
  color: rgba(255, 255, 255, 0.8); /* 设置文字颜色为半透明 */
  animation: fadeInOut 3s infinite; /* 应用动画，每次循环2秒 */
}
@keyframes fadeInOut {
  0%,
  100% {
    //background-color: rgba(24, 24, 24, 0.4);
    color: rgba(255, 255, 255, 0.4);
  }
  50% {
    //background-color: rgba(24, 24, 24, 0.6);
    color: rgba(255, 255, 255, 0.8);
  }
}

.left-arrow {
  left: 0px; /* 或根据需要调整 */
}

.right-arrow {
  right: 0px; /* 或根据需要调整 */
}
</style>
