<template>
  <el-table-column :label="$t(props.label)" :width="props.width" :align="props.align">
    <template #default="scope">
      {{ tsToTime(scope.row[props.prop]) }}
    </template>
  </el-table-column>
</template>

<script setup>
import { defineProps } from 'vue'
import { tsToTime } from '@/utils'

const props = defineProps({
  label: String,
  prop: String,
  width: String,
  // left/center/right
  align: String,
})
</script>
