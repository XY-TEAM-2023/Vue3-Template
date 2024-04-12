<!-- 规则分组 -->
<template>
  <div class="rule-box">
    <!--   当前分组逻辑AND、OR   -->
    <div :class="{ 'group-header': !props.isFirstLine }">
      <div v-if="!isFirstLine">
        <el-text v-if="model.match === 'AND'">{{ tryGetI18nText('DemandView.and') }}</el-text>

        <!--  或者  -->
        <el-text v-if="model.match === 'OR'">{{ tryGetI18nText('DemandView.or') }}</el-text>
      </div>
    </div>

    <!--  分组内的规则  -->
    <div class="group-rules" :style="rulesStyle">
      <module-rule
        v-for="(rule, i) in model.children"
        :key="i"
        :rule="rule"
        :is-first-line="i === 0"
        :is-last-line="i + 1 === model.children.length"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineModel, ref, inject, computed } from 'vue'
import ModuleRule from './ModuleRule.vue'
import { tryGetI18nText } from '@/utils'

const model = defineModel()
const props = defineProps({
  isFirstLine: {
    type: Boolean,
    default: true,
  },
  isLastLine: Boolean,
})

const matches = [
  { label: 'AND', value: 'AND' },
  { label: 'OR', value: 'OR' },
]

const rulesStyle = computed(() => {
  return {
    'padding-left': props.isFirstLine ? '1px' : '6px',
  }
})
</script>

<style scoped lang="scss">
$padding-size: 6px;
$border-color: #ccc;
$border-size: 1px;

.rule-box {
  position: relative; /* 相对定位 */
  display: flex;
  //flex-direction: column;
  border: $border-size dashed $border-color;
  //padding: 15px 30px;
}

.rule-box + .rule-box {
  margin-top: 8px;
}

.group-header {
  min-width: 55px;
  padding: ($padding-size + $border-size) $padding-size;
  //background-color: $border-color;
  border-right: $border-size dashed $border-color;
}

.group-rules {
  flex: 1;
  padding: $padding-size;
}


</style>
