<!-- 规则分组 -->
<template>
  <div class="rule-box">
    <!--   当前分组逻辑AND、OR   -->
    <div class="group-header">
      <el-select v-if="!props.isFirstLine" v-model="model.match" style="width: 100%" :class="props.readonly ? 'disabled-component' : ''">
        <template v-for="item in matches" :key="item.value">
          <el-option :label="item.label" :value="item.value" />
        </template>
      </el-select>
    </div>

    <!--  分组内的规则  -->
    <div class="group-rules" >
      <el-button v-if="model.children.length === 0" style="width: calc(100% - 12px); margin: 0 6px 0 6px" @click="onBtnAddRule(true)">
        {{ tryGetI18nText('DemandView.addRule') }}
      </el-button>

      <div v-else style="width: 100%;">
        <module-rule
          v-for="(rule, i) in model.children"
          :key="i"
          :rule="rule"
          :is-first-line="i === 0"
          :is-last-line="i + 1 === model.children.length"
        />
      </div>
    </div>

    <!--  分组操作  -->
    <div class="group-btns">
      <el-button-group class="group-btns-width">
        <el-button :icon="CloseBold" class="rule-btn-group-close" @click="onBtnDelRule" />
        <el-button :disabled="props.isFirstLine" :icon="CaretTop" circle class="rule-btn-group-item" @click="onBtnMoveRuleUp" />
        <el-button :disabled="props.isLastLine" :icon="CaretBottom" circle class="rule-btn-group-item" @click="onBtnMoveRuleDown" />
        <el-button :icon="Plus" circle class="rule-btn-group-add" @click="onBtnAddRule(false)" />
      </el-button-group>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineModel, ref, inject, computed } from 'vue'
import { CaretBottom, CaretTop, CloseBold, Delete, Plus } from '@element-plus/icons-vue'
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


const SHOW_ADD_RULE_DIALOG = inject('SHOW_ADD_RULE_DIALOG')

function onBtnAddRule(is_add_child) {
  SHOW_ADD_RULE_DIALOG(model.value.tag, is_add_child)
}

const REMOVE_RULE = inject('REMOVE_RULE')

function onBtnDelRule() {
  REMOVE_RULE(model.value.tag)
}

const MOVE_RULE_UP = inject('MOVE_RULE_UP')

function onBtnMoveRuleUp() {
  MOVE_RULE_UP(model.value.tag)
}

const MOVE_RULE_DOWN = inject('MOVE_RULE_DOWN')

function onBtnMoveRuleDown() {
  MOVE_RULE_DOWN(model.value.tag)
}
</script>

<style scoped lang="scss">
$padding-size: 6px;
$border-color: #ccc;
$border-size: 1px;
$border-style: dashed;

.rule-box {
  position: relative; /* 相对定位 */
  display: flex;
}

.rule-box + .rule-box {
  margin-top: 8px;
}

.group-header {
  min-width: 92px;
  padding: 7px 8px 0 8px;
  border-left: $border-size $border-style $border-color;
  border-top: $border-size $border-style $border-color;
  border-bottom: $border-size $border-style $border-color;
}

.group-rules {
  flex: 1;
  padding: $padding-size 0 $padding-size 0;
  border-left: $border-size $border-style $border-color;
  border-top: $border-size $border-style $border-color;
  border-bottom: $border-size $border-style $border-color;
}

.group-btns {
  flex-shrink: 0;
  padding: ($padding-size + $border-size) $padding-size 0 $padding-size;
  border: $border-size $border-style $border-color;
}

.group-btns-width {
  width: 129px;
}
</style>
