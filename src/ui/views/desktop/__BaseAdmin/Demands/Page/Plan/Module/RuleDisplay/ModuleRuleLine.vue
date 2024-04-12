<!-- 一条规则 -->
<template xmlns="http://www.w3.org/1999/html">
  <div class="rule-box-edit">
    <!--  并且  -->
    <div v-if="!isFirstLine">
      <el-text v-if="model.match === 'AND'">{{ tryGetI18nText('DemandView.and') }}</el-text>

      <!--  或者  -->
      <el-text v-if="model.match === 'OR'">{{ tryGetI18nText('DemandView.or') }}</el-text>
    </div>

    <!--  规则内容  -->
    <el-text>
      <el-tooltip effect="dark" :content="model.field_desc === '' ? 'empty' : model.field_desc" placement="top" :hide-after="0">
        <el-text type="primary">{{ model.field_name }}</el-text>
      </el-tooltip>

      <template v-if="model.check === '>'">
        <el-text type="info">&nbsp;>&nbsp;</el-text>
        <el-text>{{ model.check_val }}</el-text>
      </template>
      <template v-if="model.check === '<'">
        <el-text type="info">&nbsp;<&nbsp;</el-text>
        <el-text>{{ model.check_val }}</el-text>
      </template>
      <template v-if="model.check === '='">
        <el-text type="info">&nbsp;=&nbsp;</el-text>
        <el-text>{{ model.check_val }}</el-text>
      </template>
      <template v-if="model.check === '>='">
        <el-text type="info">&nbsp;>=&nbsp;</el-text>
        <el-text>{{ model.check_val }}</el-text>
      </template>
      <template v-if="model.check === '<='">
        <el-text type="info">&nbsp;<=&nbsp;</el-text>
        <el-text>{{ model.check_val }}</el-text>
      </template>
      <template v-if="model.check === 'include'">
        <el-text type="info">{{ tryGetI18nText('DemandView.includeText1') }}</el-text>
        <el-text>{{ model.check_val }}</el-text>
        <el-text type="info">{{ tryGetI18nText('DemandView.includeText2') }}</el-text>
      </template>
      <template v-if="model.check === 'excludes'">
        <el-text type="info">{{ tryGetI18nText('DemandView.excludesText1') }}</el-text>
        <el-text>{{ model.check_val }}</el-text>
        <el-text type="info">{{ tryGetI18nText('DemandView.excludesText2') }}</el-text>
      </template>
    </el-text>

    <el-text v-if="!isLastLine">,<br /></el-text>
  </div>
</template>

<script setup>
import { defineProps, defineModel, ref, computed, inject } from 'vue'
import { tryGetI18nText } from '@/utils'
import { useDemandStore } from '@/stores/demand'

const model = defineModel()

const props = defineProps({
  isFirstLine: Boolean,
  isLastLine: Boolean,
})

const demandStore = useDemandStore()

const fieldStyle = computed(() => {
  return {
    width: props.isFirstLine ? '400px' : 400 - 80 - 4 + 'px',
  }
})

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
  { label: 'not include', value: 'not include' },
]
</script>

<style scoped lang="scss">
.rule-box-edit {
  display: flex;
  gap: 4px;
  align-items: center;
  // 这两个padding为了和group对齐
  padding-left: 6px;
  padding-right: 6px;
}
</style>
