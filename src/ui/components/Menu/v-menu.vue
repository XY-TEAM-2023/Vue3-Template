<template>
  <div v-if="visible && position" class="menu-wrapper">
    <div :style="{ top: `${position.y}px`, left: `${position.x}px` }" class="menu">
      <ul class="menu-list">
        <li class="menu-item" v-for="item in items" :key="item.text" @click="() => onItemClick(item)">
          <div class="menu-button" @mouseenter="item.isHovered = true" @mouseleave="item.isHovered = false" :style="hoverStyle(item)">
            <component v-if="isElementIcon(item.icon)" :is="item.icon" class="icon" />
            <ui-svg
              v-else-if="item.icon"
              size="20"
              :svg-code="item.icon"
              svg-color="#898c94"
              :svg-hover-color="hoverColor(item)"
              :force-hover="item.isHovered"
            />
            <span style="margin-left: 7px">
              {{ getText(item) }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UiSvg from '@/ui/components/UiSvg.vue'
import i18n from '@/i18n'

const props = defineProps({
  items: Array,
  position: Object,
})

const items = ref(props.items)
const position = ref(props.position)
function isElementIcon(icon) {
  return icon && !icon.includes('<path')
}

const visible = ref(true)

function getText(item) {
  if (item.text.includes('.')) {
    return i18n.global.t(item.text)
  } else {
    return item.text
  }
}
function hoverColor(item) {
  return item.hoverColor ? item.hoverColor : '#3a3c42'
}

function hoverStyle(item) {
  return {
    color: item.isHovered ? hoverColor(item) : '#898c94',
  }
}

const onItemClick = (item) => {
  visible.value = false // 关闭菜单
  if (item.action && typeof item.action === 'function') {
    item.action() // 调用菜单项定义的 action
  }
}
</script>

<style scoped>
.menu-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999; /* 确保遮罩层和菜单在最顶层 */
}
.menu {
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 10px 20px rgba(64, 64, 64, 0.15);
  z-index: 10000;
  font-size: 12px;
}

ol,
ul {
  list-style: none;
}

.menu-list {
  margin: 0;
  display: block;
  width: 100%;
  padding: 6px;
  & + .menu-list {
    border-top: 1px solid #ddd;
  }
}

.menu-item {
  position: relative;
}

.menu-button {
  font: inherit;
  border: 0;
  padding: 4px 36px 4px 8px;
  width: 100%;
  border-radius: 5px;
  text-align: left;
  display: flex;
  align-items: center;
  position: relative;
  background-color: #ffffff;

  &:hover {
    background-color: #f1f3f7;
  }
}

.icon {
  width: 20px;
  height: 20px;
}
</style>
