<template>
  <div class="unselect">
    <!--   请求定义   -->
    <el-card-ex :use-fold="false">
      <template #header> 配置</template>

      <el-form-ex label-position="left">
        <el-form-item label="对话框内容">
          <el-input-label style="width: 200px" v-model="dialogTitle" :clearable="true" />
        </el-form-item>

        <el-form-item label="请求类型">
          <el-select-local
            style="width: 100px"
            v-model="data_request.type"
            :options="[
              { label: 'POST', value: 'http_post' },
              { label: 'GET', value: 'http_get' },
            ]"
          />
        </el-form-item>

        <el-form-item label="请求地址">
          <el-input-label style="width: 200px" v-model="data_request.url" :clearable="true" placeholder="/mail/delete" />
        </el-form-item>

        <el-form-item label="提交字段名">
          <el-input-label style="width: 200px" v-model="data_request.fieldKey" :clearable="true" placeholder="提交服务器中data的字段名" />
        </el-form-item>

        <el-form-item label="提交字段值">
          <el-input-label style="width: 200px" v-model="data_request.fieldValue" :clearable="true" placeholder="row对象中的字段名" />
        </el-form-item>
      </el-form-ex>
    </el-card-ex>

    <div style="display: flex">
      <el-button type="primary" @click="copyCode" style="margin-top: 10px" size="large"> 复制对话框代码</el-button>
    </div>

    <el-input type="textarea" placeholder="请输入内容" v-model="code_search" :rows="20" />
    <!--      </el-collapse-item>-->
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import ElCardEx from '@/ui/components/ElCardEx.vue'
import ElInputLabel from '@/ui/components/ElInput/ElInputLabel.vue'
import ElSelectLocal from '@/ui/components/ElSelect/ElSelectLocal.vue'
import { ElMessage } from 'element-plus'
import Dialog from '@/ui/components/DIalog/Dialog'
import ElFormEx from '@/ui/components/ElForm/ElFormEx.vue'
import { http_post } from '@/axios'

const code_search = computed(() => genCode())

function copyCode() {
  if (!navigator.clipboard) {
    Dialog.tip({
      content: '开发工具必须使用127.0.0.1进行访问',
    })
    return
  }

  const code = genCode()
  console.log(code)

  navigator.clipboard
    .writeText(code)
    .then(() => {
      ElMessage({
        message: '复制成功',
        type: 'success',
      })
    })
    .catch((err) => {
      console.error(err)
    })
}

const dialogTitle = ref('是否确认删除？')

function genCode() {
  return `
  function onDelete(row) {
    if (row.isDeleting) {
      return
    }
    row.isDeleting = true
    Dialog.tip({
      content: tryGetI18nText('是否确认删除？'),
      width: 300,
      displayCancelBtn: true,
      onClose: () => {
        row.isDeleting = false
      },
      onSubmit: () => {
        http_post('${data_request.value.url}', { ${data_request.value.fieldKey}: row.${data_request.value.fieldValue} }, true)
          .then(() => {
            requestSearch()
          })
          .catch(() => {})
          .finally(() => {
            row.isDeleting = false
          })
      },
    })
  }`
}

// 搜索请求 -----------------------------------------------------------------------------------------
const data_request = ref({
  type: 'http_post',
  url: '/test/users',
  fieldKey: '',
  fieldValue: '',
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.input-view-title {
  width: 150px;

  & + & {
    margin-left: 10px;
  }
}

.el-collapse-item {
  padding: 0px 0px 0px 0px;
}

:deep(.el-collapse-item__wrap) {
  padding: 0px 30px 0px 30px;
}

:deep(.el-collapse-item__header) {
  height: 40px;
}

.hide-form-title {
  color: #ffffff !important;
}
</style>
