<template>
  <div
    :style="{ width: size, height: size, backgroundColor: backgroundColor }"
    class="custom-icon-box unselect"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="onClick"
  >
    <svg :width="svgSize" :height="svgSize" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path :d="svgPath" :fill="isHovered ? svgHoverColor : svgColor" />
    </svg>
  </div>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue'

/* 设置SVG的Path */
const svgPath = `
M168 504.2c1-43.7 10-86.1 26.9-126 17.3-41 42.1-77.7 73.7-109.4S337 212.3 378 195c42.4-17.9 87.4-27 133.9-27s91.5 9.1 133.8 27c40.9 17.3 77.7 42.1 109.3 73.8 9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47c-5.3 4.1-3.5 12.5 3 14.1l175.7 43c5 1.2 9.9-2.6 9.9-7.7l0.8-180.9c0-6.7-7.7-10.5-12.9-6.3l-56.4 44.1C765.8 155.1 646.2 92 511.8 92 282.7 92 96.3 275.6 92 503.8c-0.1 4.5 3.5 8.2 8 8.2h60c4.4 0 7.9-3.5 8-7.8zM924 512h-60c-4.4 0-7.9 3.5-8 7.8-1 43.7-10 86.1-26.9 126-17.3 41-42.1 77.8-73.7 109.4S687 811.7 646 829c-42.4 17.9-87.4 27-133.9 27s-91.5-9.1-133.9-27c-40.9-17.3-77.7-42.1-109.3-73.8-9.9-9.9-19.2-20.4-27.8-31.4l60.2-47c5.3-4.1 3.5-12.5-3-14.1l-175.7-43c-5-1.2-9.9 2.6-9.9 7.7l-0.7 181c0 6.7 7.7 10.5 12.9 6.3l56.4-44.1C258.2 868.9 377.8 932 512.2 932c229.2 0 415.5-183.7 419.8-411.8 0.1-4.5-3.5-8.2-8-8.2z
`

/** 作为组件时，外部传参 */
const props = defineProps({
  /** 30px */
  size: {
    type: String,
    default: '24px',
  },
  /** svg大小, 整数 */
  svgSize: {
    type: Number,
    default: 0,
  },
  /** svg默认颜色 */
  svgColor: {
    type: String,
    default: 'black',
  },
  /** svg指向颜色 */
  svgHoverColor: {
    type: String,
    default: '',
  },
  bgColor: {
    type: String,
    default: 'transparent',
  },
  bgHoverColor: {
    type: String,
    default: '',
  },
})

const size = ref(props.size)
const svgColor = ref(props.svgColor)
const bgColor = ref(props.bgColor)
const svgHoverColor = ref(props.svgHoverColor)
if (svgHoverColor.value === '') {
  svgHoverColor.value = svgColor.value
}

const svgSize = ref(props.svgSize)
if (svgSize.value === 0) {
  const match = size.value.match(/\d+/) // 使用正则表达式提取数字部分
  svgSize.value = match ? parseInt(match[0], 10) : null // 转换为整数
}

const bgHoverColor = ref(props.bgHoverColor)
if (bgHoverColor.value === '') {
  bgHoverColor.value = bgColor.value
}

const isHovered = ref(false)
const backgroundColor = computed(() => {
  return isHovered.value ? bgHoverColor.value : bgColor.value
})

/** 作为子组件时，定义有什么事件 */
const emit = defineEmits(['click'])
/** 触发点击事件 */
const onClick = () => {
  emit('click', {})
}
</script>

<style scoped lang="scss">
/* 在这里添加样式，可以根据需要自定义 */
.custom-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
