<template>
  <el-card-ex ref="searchCardRef" :use-fold="true" shadow="never" style="width: 100%" @change-fold="onChangeFold">
    <template #header>
      {{ $t('app.searchParamsTitle') }}
    </template>

    <el-form-ex ref="formRef" class="table-search-container" :model="props.data" label-position="top">
      <slot name="search"></slot>
    </el-form-ex>

    <template #footer>
      <div style="display: flex; margin-left: auto">
        <el-button type="warning" @click="onResetSearchData" style="width: 100px">
          {{ $t('com.btnReset') }}
        </el-button>
        <el-button type="primary" @click="onSearch" style="width: 100px">
          {{ $t('com.btnSearch') }}
        </el-button>
      </div>
    </template>
  </el-card-ex>
</template>

<script setup>
import ElFormEx from '@/ui/components/ElForm/ElFormEx.vue'
import ElCardEx from '@/ui/components/ElCardEx.vue'
import { defineProps, inject, ref, defineEmits, computed } from 'vue'

const props = defineProps({
  data: Object,
})

const searchCardRef = ref(null)
const formRef = ref(null)

/** 搜索按钮事件 */
const onSearchInject = inject('onSearch')

function onSearch() {
  onSearchInject()
  setTimeout(() => {
    searchCardRef.value.setFold()
  }, 100)
}

const onResetSearchData = inject('onResetSearchData')
const emits = defineEmits(['changeFold'])

function onChangeFold(isFold) {
  emits('changeFold', isFold)
}

function setFold() {
  searchCardRef.value.setFold()
  emits('changeFold', true)
}

defineExpose({
  setFold,
})
</script>

<style src="./ElTableSearch.css" scoped />
<style scoped lang="scss">
:deep(.el-card) {
  border-radius: 10px;
}
</style>
