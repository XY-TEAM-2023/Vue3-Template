<template>
  <nav class="bottom-nav">
    <div class="arrow left-arrow" v-if="showLeftArrow" @click="scrollLeft">&lsaquo;</div>
    <div class="scroll-container" ref="scrollContainer" @scroll="checkScroll">
      <!--      <template v-for="(route, index) in router.config" :key="index">-->
      <!--        <ui-navigation-item :route="route" />-->
      <!--      </template>-->
      <router-link v-for="(route, index) in links" :key="index" :to="route.to" class="nav-item">
        <span class="icon">{{ route.icon }}</span>
        <span class="text">{{ route.text }}</span>
      </router-link>
    </div>
    <div class="arrow right-arrow" v-if="showRightArrow" @click="scrollRight">&rsaquo;</div>
  </nav>
</template>

<script setup>
import router from '@/router'
import UiNavigationItem from '@/ui/desktop/components/UiNavigationItem.vue'
import { reactive, ref, onMounted } from 'vue'

const links = reactive([
  { icon: '🎁', text: '이벤트', to: '/' },
  { icon: '▶️', text: '라이브쇼츠', to: '/test' },
  { icon: '▶️', text: '라이브쇼츠', to: '/test' },
  { icon: '▶️', text: '1', to: '/test' },
  { icon: '▶️', text: '2', to: '/test' },
  { icon: '▶️', text: '3', to: '/test' },
  { icon: '▶️', text: '4', to: '/test' },
  { icon: '▶️', text: '5', to: '/test' },
  // ... 更多链接
])
const showLeftArrow = ref(false)
const showRightArrow = ref(false)
onMounted(() => {
  checkScroll()
})

const scrollContainer = ref(null)

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
</script>
<style scoped>
.bottom-nav {
  width: 100%;
  height: 100%;
  padding-top: 6px;
  position: relative; /* 确保箭头能够相对于此元素定位 */
  background-color: #333;
}

.scroll-container {
  display: flex;
  z-index: 1; /* 低于箭头的 z-index */
  overflow-x: scroll; /* 始终显示水平滚动条 */
  height: 100%;
  align-items: center;
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

.nav-item {
  flex: 0 0 auto; /* 不要伸缩，避免被压缩 */
  margin: 5px;
  width: 75px;
  text-align: center;
  color: white;
  text-decoration: none;
}

.icon {
  display: block;
  font-size: 24px;
}

.text {
  font-size: 11px;
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
