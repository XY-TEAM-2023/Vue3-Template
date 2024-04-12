<!-- 一条规则 -->
<template>
  <div class="rule-box-edit">
    <!-- 匹配关系 -->
    <div class="group-header1" v-if="!props.isFirstLine">
      <div class="group-header2">
        <el-select v-model="model.match" style="width: 100%" :class="props.readonly ? 'disabled-component' : ''">
          <template v-for="item in matches" :key="item.value">
            <el-option :label="item.label" :value="item.value" />
          </template>
        </el-select>
      </div>

      <div class="split-line" />
    </div>

    <div class="rule-box-content" :style="ruleBoxContentStyle">
      <!-- 匹配字段 -->
      <el-select
        ref="fieldsRef"
        v-loading="isRefreshingFields"
        v-model="model.field_id"
        :placeholder="tryGetI18nText('DemandView.selectField')"
        filterable
        class="rule-field"
        :class="{ 'rule-field-first-line': props.isFirstLine }"
        @change="onFiledChange"
      >
        <el-option v-for="item in demandStore.fields" :key="item.id" :label="item.field" :value="item.id">
          <span style="float: left">
            {{ item.field }}
          </span>
          <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
            {{ item.desc }}
          </span>
        </el-option>

        <template #footer>
          <fields-create @refresh-cb="onRefreshFields" />
        </template>
      </el-select>

      <!-- 检查规则 -->
      <el-select v-model="model.check" class="rule-check" :class="props.readonly ? 'disabled-component' : ''">
        <template v-for="item in checks" :key="item.value">
          <el-option :label="item.label" :value="item.value" />
        </template>
      </el-select>

      <!-- 检查内容 -->
      <el-input v-model="model.check_val" class="rule-value" />

      <el-button-group class="group-btns-width">
        <el-button :icon="CloseBold" class="rule-btn-group-close" @click="onBtnDelRule" />
        <el-button :disabled="props.isFirstLine" :icon="CaretTop" circle class="rule-btn-group-item" @click="onBtnMoveRuleUp" />
        <el-button :disabled="props.isLastLine" :icon="CaretBottom" circle class="rule-btn-group-item" @click="onBtnMoveRuleDown" />
        <el-button :icon="Plus" circle class="rule-btn-group-add" @click="onBtnAddRule" />
      </el-button-group>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineModel, ref, computed, inject } from 'vue'
import { CaretBottom, CaretTop, Close, CloseBold, Delete, Plus } from '@element-plus/icons-vue'
import { tryGetI18nText } from '@/utils'
import { useDemandStore } from '@/stores/demand'
import FieldsCreate from '../../../Plan/FieldsCreate.vue'

const model = defineModel()

const props = defineProps({
  isFirstLine: Boolean,
  isLastLine: Boolean,
})

const demandStore = useDemandStore()

const ruleBoxContentStyle = computed(() => {
  return {
    'margin-left': props.isFirstLine ? '8px' : '7px',
    'margin-right': props.isFirstLine ? '7px' : '7px',
  }
})

const SHOW_ADD_RULE_DIALOG = inject('SHOW_ADD_RULE_DIALOG')

function onBtnAddRule() {
  SHOW_ADD_RULE_DIALOG(model.value.tag, false)
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

const fieldsRef = ref(null)
const isRefreshingFields = ref(false)

function onRefreshFields() {
  // fieldsRef.value.blur()
  isRefreshingFields.value = true
  demandStore
    .refreshFields()
    .then(() => {})
    .catch(() => {})
    .finally(() => {
      isRefreshingFields.value = false
    })
}

const matches = [
  { label: 'AND', value: 'AND' },
  { label: 'OR', value: 'OR' },
]

const checks = [
  { label: '=', value: '=' },
  { label: '>', value: '>' },
  { label: '<', value: '<' },
  { label: '>=', value: '>=' },
  { label: '<=', value: '<=' },
  { label: 'include', value: 'include' },
  { label: 'excludes', value: 'excludes' },
]

function onFiledChange() {
  const info = demandStore.getFieldInfoById(model.value.field_id)
  model.value.field_name = info.field
  model.value.field_desc = info.desc
}
</script>

<style scoped lang="scss">
$border-color: #b0b0b0;
$border-size: 1px;

.rule-box-edit {
  display: flex;
  align-items: center;
}

.group-header1 {
  display: flex;
  align-items: center;
}

.group-header2 {
  min-width: 76px;
  margin: 0 8px 0 8px;
}

.split-line {
  height: 16px;
  border-left: $border-size dashed $border-color;
}

.rule-field {
  width: 240px;
  flex-shrink: 0;
}

.rule-field-first-line {
  width: 331px;
}

.rule-check {
  width: 105px;
  flex-shrink: 0;
}

.rule-value {
  flex: 1;
  min-width: 144px;
  flex-shrink: 0;
}

.rule-box-content {
  margin-left: 7px;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
}

.group-btns-width {
  width: 129px;
  flex-shrink: 0;
}
</style>
