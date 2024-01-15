<!--  Form：输入整数  -->
<template>
  <el-date-picker
    v-model="displayValue"
    type="datetimerange"
    :shortcuts="shortcuts"
    :clearable="props.clearable"
    :format="props.format"
    :value-format="props.valueFormat"
    @change="onChange"
  />
</template>

<script setup>
import { defineProps, defineModel, ref, watch } from 'vue'
import { timestampToTimezoneDate } from '@/utils/timeUtil'

const model = defineModel()
const props = defineProps({
  /** 默认开始时间 */
  defaultStartTs: Number,
  defaultEndTs: Number,
  clearable: Boolean,
  format: String,
})

let finalValue = [timestampToTimezoneDate(props.defaultStartTs), timestampToTimezoneDate(props.defaultEndTs)]
const displayValue = ref(finalValue)
// 最终值（临时）用于重置表单时，同步重置显示值

const shortcuts = [
  {
    text: '今天',
    value: () => {
      const start = new Date()
      start.setHours(0, 0, 0, 0)

      const end = new Date()
      end.setDate(start.getDate() + 1)
      return [start, end]
    },
  },
  {
    text: '昨天',
    value: () => {
      // 获取当前日期
      const today = new Date()

      // 获取昨天的日期
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)

      // 设置昨天的开始时间（将时间设置为零点）
      const start = new Date(yesterday)
      start.setHours(0, 0, 0, 0)

      // 设置昨天的结束时间（将时间设置为23:59:59.999）
      const end = new Date(yesterday)
      end.setHours(23, 59, 59, 999)

      return [start, end]
    },
  },
  {
    text: '最近7天',
    value: () => {
      // 获取当前日期
      const today = new Date()

      // 设置时间为零点
      today.setHours(0, 0, 0, 0)

      // 获取7天前的日期
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(today.getDate() - 7)

      // 获取最近7天的开始时间（7天前的日期）
      const start = sevenDaysAgo

      // 获取最近7天的结束时间（昨天的日期，时间设置为23:59:59）
      const end = new Date(today)
      end.setDate(today.getDate() - 1)
      end.setHours(23, 59, 59, 999)

      return [start, end]
    },
  },
  {
    text: '本月',
    value: () => {
      // 获取当前日期
      const current = new Date()

      // 获取本月的第一天
      const start = new Date(current.getFullYear(), current.getMonth(), 1)

      // 设置时间为零点
      start.setHours(0, 0, 0, 0)

      return [start, current]
    },
  },
  {
    text: '上个月',
    value: () => {
      // 获取当前日期
      const today = new Date()

      // 获取上个月的第一天
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1)

      // 设置时间为零点
      start.setHours(0, 0, 0, 0)

      // 获取上个月的最后一天
      const end = new Date(today.getFullYear(), today.getMonth(), 0)
      // 设置时间为23:59:59.999
      end.setHours(23, 59, 59, 999)
      return [start, end]
    },
  },
]

/* 实现外部修改了变量，内部同步变化 */
watch(
  () => [model],
  ([newModel], [oldModel]) => {
    if (newModel.value === undefined) {
      finalValue[0] = 0
      finalValue[1] = 0
      displayValue.value = []
    } else if (finalValue[0] !== newModel.value[0] && finalValue[1] !== newModel.value[1]) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>.')
      finalValue[0] = newModel.value[0]
      finalValue[1] = newModel.value[1]
      displayValue.value = [timestampToTimezoneDate(finalValue[0]), timestampToTimezoneDate(finalValue[1])]
    }
  },
  { deep: true }
)

const emits = defineEmits(['change'])
function onChange(val) {
  if (val) {
    finalValue[0] = val[0].getTime()
    finalValue[1] = val[1].getTime()
  } else {
    finalValue = undefined
  }
  model.value = finalValue
  emits('change', finalValue)
}
</script>

<style scoped lang="scss"></style>
