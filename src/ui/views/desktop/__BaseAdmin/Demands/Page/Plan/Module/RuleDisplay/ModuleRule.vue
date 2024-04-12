<!-- 根据不同的规则类型，使用不同的组件 -->
<template>
  <component
    :is="com"
    v-model="props.rule"
    :show-match="showMatch"
    :is-first-line="props.isFirstLine"
    :is-last-line="props.isLastLine"
    class="rule-content"
  />
</template>

<script setup>
import { defineProps, computed, ref } from 'vue'
import ModuleRuleLine from './ModuleRuleLine.vue'
import ModuleRuleGroup from './ModuleRuleGroup.vue'
import ModuleRuleUseModule from './ModuleRuleUseModule.vue'

const props = defineProps({
  rule: Object,
  isFirstLine: Boolean,
  isLastLine: Boolean,
})

const showMatch = ref(false)

const com = computed(() => {
  if (props.rule) {
    if (props.rule.type === 'rule') {
      return ModuleRuleLine
    } else if (props.rule.type === 'group') {
      return ModuleRuleGroup
    } else if (props.rule.type === 'module') {
      return ModuleRuleUseModule
    }
  }
  return ''
})

// const showColumn = inject('showColumnFun')
function requestRuleInfo() {}
</script>

<style lang="scss">
.rule-content + .rule-content {
  margin-top: 8px;
}

.rule-btn-group-close {
  height: 30px;
  width: 36px;
  //padding-left: 11px;
  color: #f56c6c;
}

.rule-btn-group-item {
  height: 30px;
}

.rule-btn-group-add {
  height: 30px;
  padding-right: 11px;
}
</style>
