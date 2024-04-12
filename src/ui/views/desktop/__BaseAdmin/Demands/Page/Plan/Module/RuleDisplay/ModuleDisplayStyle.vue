<!--编辑模式下的模块-->
<template>
  <div v-loading="isRequestingFields" class="display-style-body">
    <div v-if="props.rules.length > 0">
      <!--    规则列表    -->
      <module-rule
        v-for="(rule, i) in props.rules"
        :key="i"
        :rule="rule"
        parent-tag=""
        :is-first-line="i === 0"
        :is-last-line="i + 1 === props.rules.length"
      />
    </div>
    <div v-else>
      <!--    添加规则    -->
      {{ tryGetI18nText('DemandView.addRule') }}
    </div>
  </div>
</template>

<script setup>
import { provide, ref, onMounted } from 'vue'
import { tryGetI18nText } from '@/utils'
import ModuleRule from './ModuleRule.vue'
import { useDemandStore } from '@/stores/demand'
import Dialog from '@/ui/components/DIalog/Dialog'

const demandStore = useDemandStore()

const props = defineProps({
  rules: Array,
})

onMounted(() => {
  refreshFields()
})

const isRequestingFields = ref(false)

function refreshFields() {
  isRequestingFields.value = true
  demandStore
    .refreshFields()
    .then(() => {
      // console.log('fields', demandStore.fields)
    })
    .catch(() => {
      Dialog.tip({
        content: tryGetI18nText('DemandView.initFail'),
        displayCancelBtn: true,
        onSubmit: refreshFields,
      })
    })
    .finally(() => {
      isRequestingFields.value = false
    })
}
</script>

<style scoped lang="scss">
.display-style-body {
  width: 100%;
}
</style>
