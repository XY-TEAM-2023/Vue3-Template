<template>
  <div class="unselect">
    <el-collapse v-model="activeName">
      <!--   请求定义   -->
      <el-card-ex>
        <template #header> 对话窗</template>

        <el-form label-position="left" :inline="true">
          <el-form-item label="标题">
            <el-input-label style="width: 200px" v-model="dialogTitle" :clearable="true" />
          </el-form-item>
        </el-form>
      </el-card-ex>

      <!--   请求定义   -->
      <el-card-ex style="margin-top: 10px">
        <template #header> 请求定义</template>

        <el-form :model="data_request" label-position="top" :inline="true">
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
            <el-input-label style="width: 200px" v-model="data_request.url" :clearable="true" />
          </el-form-item>
        </el-form>
      </el-card-ex>

      <!--   提交参数   -->
      <el-card-ex shadow="never" style="margin-top: 10px">
        <template #header>提交参数</template>

        <template #default>
          <div style="padding-left: 80px">
            <template v-for="(item, index) in data_search" :key="index">
              <el-card-ex :use-fold="true" shadow="never">
                <el-scrollbar>
                  <el-form ref="searchFormRef" label-position="top">
                    <div style="display: flex; width: 100%; column-gap: 20px; height: 64px">
                      <!--  文本类型  -->
                      <template v-if="item.type === 1">
                        <el-form-item label="标题" :required="true">
                          <el-input v-model="item.title" placeholder="*标题" style="width: 140px" />
                        </el-form-item>

                        <el-form-item label="参数名" :required="true">
                          <el-input v-model="item.field" placeholder="title" style="width: 100px" />
                        </el-form-item>

                        <!--  数据类型  -->
                        <el-form-item label="数据类型">
                          <div style="height: 100%">
                            <el-tag :color="item.color" style="color: #f1f3f7; font-weight: normal; min-width: 80px">
                              {{ item.typeTitle }}
                            </el-tag>
                          </div>
                        </el-form-item>

                        <el-form-item label="必填">
                          <el-switch
                            v-model="item.must"
                            inline-prompt
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #cdd0d7"
                          />
                        </el-form-item>

                        <el-form-item label="限制">
                          <el-switch
                            v-model="item.RuleBol"
                            inline-prompt
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #cdd0d7"
                          />
                        </el-form-item>

                        <el-form-item label="最小长度" v-if="item.RuleBol">
                          <el-input-number
                            v-model="item.min"
                            placeholder="0"
                            type="number"
                            style="width: 80px"
                            :min="0"
                            :controls="false"
                          />
                        </el-form-item>

                        <el-form-item label="最大长度" v-if="item.RuleBol">
                          <el-input-number
                            v-model="item.max"
                            placeholder="0"
                            type="number"
                            style="width: 80px"
                            :controls="false"
                            :min="0"
                          />
                        </el-form-item>

                        <!--                        <el-form-item label="允许值">-->
                        <!--                          <el-input v-model="item.limit" placeholder="以|分割。a|b|c" style="width: 150px" clearable />-->
                        <!--                        </el-form-item>-->

                        <el-form-item label="默认值">
                          <el-input v-model="item.defaultVal" style="width: 100px" />
                        </el-form-item>

                        <el-form-item label="提示文本" style="width: 100%">
                          <el-input v-model="item.placeholder" style="min-width: 100px" />
                        </el-form-item>

                        <div style="margin-top: 30px">
                          <el-button type="danger" :icon="Delete" circle @click="formData.remove(index)" />
                        </div>
                      </template>

                      <!--  小数  -->
                      <template v-if="item.type === 3">
                        <el-form-item label="标题" :required="true">
                          <el-input v-model="item.title" placeholder="*标题" style="width: 140px" />
                        </el-form-item>

                        <el-form-item label="参数名" :required="true">
                          <el-input v-model="item.field" placeholder="title" style="width: 100px" />
                        </el-form-item>

                        <!--  数据类型  -->
                        <el-form-item label="数据类型">
                          <div style="height: 100%">
                            <el-tag :color="item.color" style="color: #f1f3f7; font-weight: normal; min-width: 80px">
                              {{ item.typeTitle }}
                            </el-tag>
                          </div>
                        </el-form-item>

                        <el-form-item label="必填">
                          <el-switch
                            v-model="item.must"
                            inline-prompt
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #cdd0d7"
                          />
                        </el-form-item>

                        <el-form-item label="限制">
                          <el-switch
                            v-model="item.RuleBol"
                            inline-prompt
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #cdd0d7"
                          />
                        </el-form-item>

                        <el-form-item label="最小值" v-if="item.RuleBol">
                          <el-input-float v-model="item.min" style="width: 80px" />
                        </el-form-item>

                        <el-form-item label="最大值" v-if="item.RuleBol">
                          <el-input-float v-model="item.max" style="width: 80px" />
                        </el-form-item>

                        <!--                        <el-form-item label="允许值">-->
                        <!--                          <el-input v-model="item.limit" placeholder="以|分割。1|2|3" style="width: 150px" clearable />-->
                        <!--                        </el-form-item>-->

                        <el-form-item label="默认值">
                          <el-input-float v-model="item.defaultVal" style="width: 100px" />
                        </el-form-item>

                        <el-form-item label="提示文本" style="width: 100%">
                          <el-input v-model="item.placeholder" style="min-width: 100px" />
                        </el-form-item>

                        <div style="margin-top: 30px">
                          <el-button type="danger" :icon="Delete" circle @click="formData.remove(index)" />
                        </div>
                      </template>

                      <!--  整数  -->
                      <template v-if="item.type === 4">
                        <el-form-item label="标题" :required="true">
                          <el-input v-model="item.title" placeholder="*标题" style="width: 140px" />
                        </el-form-item>

                        <el-form-item label="参数名" :required="true">
                          <el-input v-model="item.field" placeholder="title" style="width: 100px" />
                        </el-form-item>

                        <!--  数据类型  -->
                        <el-form-item label="数据类型">
                          <div style="height: 100%">
                            <el-tag :color="item.color" style="color: #f1f3f7; font-weight: normal; min-width: 80px">
                              {{ item.typeTitle }}
                            </el-tag>
                          </div>
                        </el-form-item>

                        <el-form-item label="必填">
                          <el-switch
                            v-model="item.must"
                            inline-prompt
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #cdd0d7"
                          />
                        </el-form-item>

                        <el-form-item label="限制">
                          <el-switch
                            v-model="item.RuleBol"
                            inline-prompt
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #cdd0d7"
                          />
                        </el-form-item>

                        <el-form-item label="最小值" v-if="item.RuleBol">
                          <el-input-number v-model="item.min" placeholder="0" type="number" style="width: 80px" :controls="false" />
                        </el-form-item>

                        <el-form-item label="最大值" v-if="item.RuleBol">
                          <el-input-number v-model="item.max" placeholder="0" type="number" style="width: 80px" :controls="false" />
                        </el-form-item>

                        <!--                        <el-form-item label="允许值">-->
                        <!--                          <el-input v-model="item.limit" placeholder="以|分割。1|2|3" style="width: 150px" clearable />-->
                        <!--                        </el-form-item>-->

                        <el-form-item label="默认值">
                          <el-input-integer v-model="item.defaultVal" style="width: 100px" />
                        </el-form-item>

                        <el-form-item label="提示文本" style="width: 100%">
                          <el-input v-model="item.placeholder" style="min-width: 100px" />
                        </el-form-item>

                        <div style="margin-top: 30px">
                          <el-button type="danger" :icon="Delete" circle @click="formData.remove(index)" />
                        </div>
                      </template>

                      <!--  选择框  -->
                      <template v-if="item.type === 5">
                        <el-form-item label="标题" :required="true">
                          <el-input v-model="item.title" placeholder="*标题" style="width: 140px" />
                        </el-form-item>

                        <el-form-item label="参数名" :required="true">
                          <el-input v-model="item.field" placeholder="title" style="width: 100px" />
                        </el-form-item>

                        <!--  数据类型  -->
                        <el-form-item label="数据类型">
                          <div style="height: 100%">
                            <el-tag :color="item.color" style="color: #f1f3f7; font-weight: normal; min-width: 80px">
                              {{ item.typeTitle }}
                            </el-tag>
                          </div>
                        </el-form-item>

                        <el-form-item label="必填">
                          <el-switch
                            v-model="item.must"
                            inline-prompt
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #cdd0d7"
                          />
                        </el-form-item>

                        <el-form-item label="数据来源" :required="true">
                          <el-select v-model="item.select.type" placeholder="" style="width: 110px">
                            <el-option label="代码定义" value="code" />
                            <el-option label="网络请求" value="url" />
                          </el-select>
                        </el-form-item>

                        <template v-if="item.select.type === 'code'">
                          <el-form-item label="数据来源-代码定义" :required="true">
                            <el-input v-model="item.select.dataFromCode" placeholder="格式：key=value&key2=value2" style="width: 500px" />
                          </el-form-item>
                        </template>

                        <template v-if="item.select.type === 'url'">
                          <el-form-item label="数据来源-地址" :required="true">
                            <el-input v-model="item.select.dataFromUrl" placeholder="/role/list" style="width: 220px" />
                          </el-form-item>

                          <el-form-item label="数据来源-字段" :required="true">
                            <el-input v-model="item.select.dataFromField" placeholder="records" style="width: 160px" />
                          </el-form-item>

                          <el-form-item label="用于显示的字段" :required="true">
                            <el-input v-model="item.select.fieldLabel" placeholder="name" style="width: 160px" />
                          </el-form-item>

                          <el-form-item label="选中后的值" :required="true">
                            <el-input v-model="item.select.fieldValue" placeholder="id" style="width: 160px" />
                          </el-form-item>
                        </template>

                        <el-form-item label="提示文本" style="width: 100%">
                          <el-input v-model="item.placeholder" style="min-width: 100px" />
                        </el-form-item>

                        <div style="margin-top: 30px">
                          <el-button type="danger" :icon="Delete" circle @click="formData.remove(index)" />
                        </div>
                      </template>

                      <!--  逻辑值  -->
                      <template v-if="item.type === 6">
                        <el-form-item label="标题" :required="true">
                          <el-input v-model="item.title" placeholder="*标题" style="width: 140px" />
                        </el-form-item>

                        <el-form-item label="参数名" :required="true">
                          <el-input v-model="item.field" placeholder="title" style="width: 100px" />
                        </el-form-item>

                        <!--  数据类型  -->
                        <el-form-item label="数据类型">
                          <div style="height: 100%">
                            <el-tag :color="item.color" style="color: #f1f3f7; font-weight: normal; min-width: 80px">
                              {{ item.typeTitle }}
                            </el-tag>
                          </div>
                        </el-form-item>

                        <el-form-item label="必填">
                          <el-switch
                            v-model="item.must"
                            inline-prompt
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #cdd0d7"
                          />
                        </el-form-item>

                        <el-form-item label="默认值" style="min-width: 55px">
                          <el-checkbox v-model="item.defaultVal" />
                        </el-form-item>

                        <!--                        <el-form-item label="提示文本" style="width: 100%">-->
                        <!--                          <el-input v-model="item.placeholder" style="min-width: 100px" />-->
                        <!--                        </el-form-item>-->

                        <div style="margin-top: 30px; margin-left: auto">
                          <el-button type="danger" :icon="Delete" circle @click="formData.remove(index)" />
                        </div>
                      </template>

                      <!--  时间区间  -->
                      <template v-if="item.type === 2">
                        <el-form-item label="标题" :required="true">
                          <el-input v-model="item.title" placeholder="*标题" style="width: 140px" />
                        </el-form-item>

                        <el-form-item label="参数名" :required="true">
                          <el-input v-model="item.field" placeholder="title" style="width: 100px" />
                        </el-form-item>

                        <!--  数据类型  -->
                        <el-form-item label="数据类型">
                          <div style="height: 100%">
                            <el-tag :color="item.color" style="color: #f1f3f7; font-weight: normal; min-width: 80px">
                              {{ item.typeTitle }}
                            </el-tag>
                          </div>
                        </el-form-item>

                        <el-form-item label="必填">
                          <el-switch
                            v-model="item.must"
                            inline-prompt
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #cdd0d7"
                          />
                        </el-form-item>

                        <el-form-item label="提示文本" style="width: 100%">
                          <el-input v-model="item.placeholder" style="min-width: 100px" />
                        </el-form-item>

                        <div style="margin-top: 30px">
                          <el-button type="danger" :icon="Delete" circle @click="formData.remove(index)" />
                        </div>
                      </template>

                      <!--  指定时间  -->
                      <template v-if="item.type === 7">
                        <el-form-item label="标题" :required="true">
                          <el-input v-model="item.title" placeholder="*标题" style="width: 140px" />
                        </el-form-item>

                        <el-form-item label="参数名" :required="true">
                          <el-input v-model="item.field" placeholder="title" style="width: 100px" />
                        </el-form-item>

                        <!--  数据类型  -->
                        <el-form-item label="数据类型">
                          <div style="height: 100%">
                            <el-tag :color="item.color" style="color: #f1f3f7; font-weight: normal; min-width: 80px">
                              {{ item.typeTitle }}
                            </el-tag>
                          </div>
                        </el-form-item>

                        <el-form-item label="必填">
                          <el-switch
                            v-model="item.must"
                            inline-prompt
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #cdd0d7"
                          />
                        </el-form-item>

                        <el-form-item label="提示文本" style="width: 100%">
                          <el-input v-model="item.placeholder" style="min-width: 100px" />
                        </el-form-item>

                        <div style="margin-top: 30px">
                          <el-button type="danger" :icon="Delete" circle @click="formData.remove(index)" />
                        </div>
                      </template>

                      <!--  指定时间  -->
                      <template v-if="item.type === 8">
                        <el-form-item label="标题" :required="true">
                          <el-input v-model="item.title" placeholder="*标题" style="width: 140px" />
                        </el-form-item>

                        <el-form-item label="参数名" :required="true">
                          <el-input v-model="item.field" placeholder="title" style="width: 100px" />
                        </el-form-item>

                        <!--  数据类型  -->
                        <el-form-item label="数据类型">
                          <div style="height: 100%">
                            <el-tag :color="item.color" style="color: #f1f3f7; font-weight: normal; min-width: 80px">
                              {{ item.typeTitle }}
                            </el-tag>
                          </div>
                        </el-form-item>

                        <el-form-item label="必填">
                          <el-switch
                            v-model="item.must"
                            inline-prompt
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #cdd0d7"
                          />
                        </el-form-item>

                        <el-form-item label="提示文本" style="width: 100%">
                          <el-input v-model="item.placeholder" style="min-width: 100px" />
                        </el-form-item>

                        <div style="margin-top: 30px">
                          <el-button type="danger" :icon="Delete" circle @click="formData.remove(index)" />
                        </div>
                      </template>
                    </div>
                  </el-form>
                </el-scrollbar>
              </el-card-ex>
            </template>
          </div>

          <!--  添加搜索字段  -->
          <el-form-item label="添加搜索" label-width="80">
            <el-button-group>
              <el-button v-for="item in searchDataTypeList" :key="item.value" type="primary" @click="formData.add(item)">
                {{ item.text }}
              </el-button>
            </el-button-group>

            <el-button style="margin-left: 10px" type="danger" @click="data_search.splice(0, data_search.length)">清空 </el-button>
          </el-form-item>
        </template>
      </el-card-ex>

      <div style="display: flex">
        <el-button type="primary" @click="copyCode" style="margin-top: 10px" size="large"> 复制对话框代码</el-button>
      </div>

      <el-input type="textarea" placeholder="请输入内容" v-model="code_search" :rows="20" />
      <!--      </el-collapse-item>-->
    </el-collapse>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import ElCardEx from '@/ui/components/ElCardEx.vue'
import ElInputFloat from '@/ui/components/ElInput/ElInputFloat.vue'
import { VueDraggable } from 'vue-draggable-plus'
import ElInputLabel from '@/ui/components/ElInput/ElInputLabel.vue'
import ElSelectLocal from '@/ui/components/ElSelect/ElSelectLocal.vue'
import ElTableColumnInteger from '@/ui/components/ElTable/ElTableColumnInteger.vue'
import { ElMessage } from 'element-plus'
import ElInputInteger from '@/ui/components/ElInput/ElInputInteger.vue'
import Dialog from '@/ui/components/DIalog/Dialog'

const activeName = ref('')
const data_page = reactive({
  dir: '',
  view: '',
})

/** 路由配置相关数据 */
const data_route = reactive({
  parent: '',
  config: {
    name: '',
    component: '',
    meta: {
      title: { zh: '', en: '', ko: '' },
      icon: '<svg t="1704707468883" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="43765" width="32" height="32"><path d="M682.666667 85.333333l213.333333 213.333334v597.674666a42.368 42.368 0 0 1-42.368 42.325334H170.368A42.666667 42.666667 0 0 1 128 896.341333V127.658667C128 104.277333 146.986667 85.333333 170.368 85.333333H682.666667z m-213.333334 554.666667v85.333333h85.333334v-85.333333h-85.333334z m85.333334-70.186667A149.418667 149.418667 0 0 0 512 277.333333a149.376 149.376 0 0 0-146.474667 120.021334l83.712 16.768A64 64 0 1 1 512 490.666667a42.666667 42.666667 0 0 0-42.666667 42.666666V597.333333h85.333334v-27.52z" p-id="43766"></path></svg>',
      cache: true,
      needLogin: true,
      public: {
        desktop: true,
        mobile: false,
      },
    },
  },
})

// 搜索参数 -----------------------------------------------------------------------------------------

/** 支持的数据类型 */
const searchDataTypeList = [
  { text: '文本型', value: 1, color: '#2c3e50' },
  { text: '整数型', value: 4, color: '#6b6882' },
  { text: '小数型', value: 3, color: '#0eb83a' },
  { text: '选择框', value: 5, color: '#ac4fb6' },
  { text: '逻辑型', value: 6, color: '#c32136' },
  { text: '时间区间', value: 2, color: '#ff7500' },
  { text: '指定日期', value: 7, color: '#003371' },
  { text: '指定日期时间', value: 8, color: '#003371' },
]

const data_search = reactive([])

function parseQueryString(queryString) {
  const params = new URLSearchParams(queryString)
  const obj = []

  for (const [key, value] of params) {
    obj.push({
      label: key,
      value: value,
    })
  }

  return JSON.stringify(obj)
}

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

function genCode() {
  let temp_search_data_list = ''
  // 搜索参数定义
  let code_formDataFields = ''
  let code_formRules = ''
  let code_customRules = ''

  let code_options = ''

  data_search.forEach((field) => {
    let temp_rules = ''
    const fieldBig = field.title.charAt(0).toUpperCase() + field.title.slice(1)

    if (field.must) {
      temp_rules += `    { required: true, message: tryGetI18nText('${field.title}不能为空'), trigger: 'blur' },`
    }

    if (field.type === 1) {
      if (temp_rules !== '') {
        temp_rules += '\r\n'
      }

      // 文本
      code_formDataFields += `
      /** ${field.title} */
      ${field.field ? field.field : '???'}: ${field.defaultVal ? "'" + field.defaultVal + "'" : undefined},`

      if (field.RuleBol) {
        temp_rules += `    { validator: ruleCheck${fieldBig}, trigger: 'blur' },`
        code_customRules += `
/** 检查${field.field}数据 */
function ruleCheck${fieldBig}(rule, value, callback) {
  if(value.length >= ${field.min} && value.length <= ${field.max}) {
    callback()
  } else {
    callback(new Error('长度大于等于${field.min}, 小于等于${field.max}'))
  }
}`
      }

      temp_search_data_list += `
          <el-form-item-label label='${field.title}' v-model='formData.${field.field ? field.field : '???'}' prop='${field.field}' ${
            field.placeholder !== '' ? "placeholder='" + field.placeholder + "'" : ''
          } clearable />`
    } else if (field.type === 4) {
      if (temp_rules !== '') {
        temp_rules += '\r\n'
      }

      // 整数
      code_formDataFields += `
      /** ${field.title} */
      ${field.field ? field.field : '???'}: ${field.defaultVal ? field.defaultVal : undefined},`

      if (field.RuleBol) {
        temp_rules += `    { validator: ruleCheck${fieldBig}, trigger: 'blur' },`
        code_customRules += `
/** 检查${field.field}数据 */
function ruleCheck${fieldBig}(rule, value, callback) {
  value = parseInt(value)
  if(value >= ${field.min} && value <= ${field.max}) {
    callback()
  } else {
    callback(new Error('值有效范围大于等于${field.min}, 小于等于${field.max}'))
  }
}`
      }

      temp_search_data_list += `
          <el-form-item-integer label='${field.title}' v-model='formData.${field.field ? field.field : '???'}' prop='${field.field}' ${
            field.placeholder !== '' ? "placeholder='" + field.placeholder + "'" : ''
          } clearable />`
    } else if (field.type === 3) {
      if (temp_rules !== '') {
        temp_rules += '\r\n'
      }

      // 小数
      code_formDataFields += `
      /** ${field.title} */
      ${field.field ? field.field : '???'}: ${field.defaultVal ? field.defaultVal : undefined},`

      if (field.RuleBol) {
        temp_rules += `    { validator: ruleCheck${fieldBig}, trigger: 'blur' },`
        code_customRules += `
/** 检查${field.field}数据 */
function ruleCheck${fieldBig}(rule, value, callback) {
  value = parseInt(value)
  if(value >= ${field.min} && value <= ${field.max}) {
    callback()
  } else {
    callback(new Error('值有效范围大于等于${field.min}, 小于等于${field.max}'))
  }
}`
      }

      temp_search_data_list += `
          <el-form-item-float label='${field.title}' v-model='formData.${field.field ? field.field : '???'}' prop='${field.field}' ${
            field.placeholder !== '' ? "placeholder='" + field.placeholder + "'" : ''
          } clearable />`
    } else if (field.type === 5) {
      // 选择框
      code_formDataFields += `
      /** ${field.title} */
      ${field.field ? field.field : '???'}: undefined,`

      if (field.select.type === 'code') {
        let options = field.select.dataFromCode
        if (options.includes('=')) {
          options = parseQueryString(options)
        }
        code_options += `
const ${field.field}Options=${options}
          `
        temp_search_data_list += `
          <el-form-item-select-local label='${field.title}' v-model='formData.${field.field ? field.field : '???'}' :options='${
            field.field
          }Options' prop='${field.field}' ${field.placeholder !== '' ? ":placeholder='" + field.placeholder + "'" : ''} clearable />`
      } else if (field.select.type === 'url') {
        temp_search_data_list += `
          <el-form-item-select-server label='${field.title}' v-model='formData.${field.field ? field.field : '???'}' prop='${
            field.field
          }' url='${field.select.dataFromUrl}' field='${field.select.dataFromField}' ${
            field.placeholder !== '' ? "placeholder='" + field.placeholder + "'" : ''
          } field-label='${field.select.fieldLabel}' field-value='${field.select.fieldValue}' clearable />`
      }
    } else if (field.type === 6) {
      // 逻辑型
      code_formDataFields += `
      /** ${field.title} */
      ${field.field ? field.field : '???'}: ${field.defaultVal ? field.defaultVal : undefined},`

      temp_search_data_list += `
          <el-form-item-checkbox label='${field.title}' v-model='formData.${field.field ? field.field : '???'}' />`
    } else if (field.type === 2) {
      // 时间区间
      code_formDataFields += `
      /** ${field.title} */
      ${field.field ? field.field : '???'}: undefined,`

      temp_search_data_list += `
          <el-form-item-date-range label='${field.title}' v-model='formData.${field.field ? field.field : '???'}' prop='${field.field}' ${
            field.placeholder !== '' ? "placeholder='" + field.placeholder + "'" : ''
          } clearable />`
    } else if (field.type === 7) {
      // 指定日期
      code_formDataFields += `
      /** ${field.title} */
      ${field.field ? field.field : '???'}: undefined,`

      temp_search_data_list += `
          <el-form-item-date label='${field.title}' v-model='formData.${field.field ? field.field : '???'}' prop='${field.field}' ${
            field.placeholder !== '' ? "placeholder='" + field.placeholder + "'" : ''
          } clearable />`
    } else if (field.type === 8) {
      // 指定日期时间
      code_formDataFields += `
      /** ${field.title} */
      ${field.field ? field.field : '???'}: undefined,`

      temp_search_data_list += `
          <el-form-item-date-time label='${field.title}' v-model='formData.${field.field ? field.field : '???'}' prop='${field.field}' ${
            field.placeholder !== '' ? "placeholder='" + field.placeholder + "'" : ''
          } clearable />`
    }

    if (temp_rules.trim() !== '') {
      code_formRules += `
  ${field.field}: [
    ${temp_rules}
  ],`
    }
  })

  let code_template = `<template>
  <el-button type='primary' @click='onShow'>
    {{ tryGetI18nText('${dialogTitle.value}') }}
  </el-button>

  <el-dialog v-model='display' :title="tryGetI18nText('${dialogTitle.value}')" width='520' :close-on-click-modal='false'>
    <el-form-ex ref='formDataRef' :model='formData' label-position='left' :rules='formRules'>${temp_search_data_list}
    </el-form-ex>

    <template #footer>
      <span class='dialog-footer'>
        <el-button @click='display = false'>
          {{ $t('com.btnCancel') }}
        </el-button>

        <el-button v-loading='isSubmitting' type='primary' @click='onSubmit'>
          {{ $t('com.btnSubmit') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>`

  let code = `${code_template}

<script setup>
import { reactive, ref, nextTick, defineExpose } from 'vue'
import ElFormEx from '@/ui/components/ElForm/ElFormEx.vue'
import ElFormItemLabel from '@/ui/components/ElForm/ElFormItemLabel.vue'
import ElFormItemInteger from '@/ui/components/ElForm/ElFormItemInteger.vue'
import ElFormItemSelectLocal from '@/ui/components/ElForm/ElFormItemSelectLocal.vue'
import ElFormItemSelectServer from '@/ui/components/ElForm/ElFormItemSelectServer.vue'
import ElFormItemFloat from '@/ui/components/ElForm/ElFormItemFloat.vue'
import ElFormItemCheckbox from '@/ui/components/ElForm/ElFormItemCheckbox.vue'
import ElFormItemDateRange from '@/ui/components/ElForm/ElFormItemDateRange.vue'
import ElFormItemDateTime from '@/ui/components/ElForm/ElFormItemDateTime.vue'
import ElFormItemDate from '@/ui/components/ElForm/ElFormItemDate.vue'
import { http_get, http_post } from '@/axios'
import { useAppStore } from '@/stores/app'
import { tryGetI18nText } from '@/utils'
import { cloneDeep } from 'lodash-es'

/** 是否显示窗口 */
const display = ref(false)
/** form表单对象 */
const formDataRef = ref(null)
/** 是否提交中 */
const isSubmitting = ref(false)
/** form表单数据 */
const formData = ref({${code_formDataFields}
})

${code_options}

/** 表格数据检测规则 */
const formRules = reactive({${code_formRules}
})

${code_customRules}

/** 显示窗口 */
async function show(data) {
  if (display.value) {
    return
  }
  formData.value = cloneDeep(data)
  display.value = true
  await nextTick()
  // 自定义参数初始化
}


// 使用 defineExpose 暴露方法
defineExpose({ show })

/** 刷新事件 */
const emit = defineEmits(['refreshCb'])

/** 提交事件 */
async function onSubmit() {
  if (isSubmitting.value) {
    return
  }

  await formDataRef.value.validate((valid) => {
    if (valid) {
      isSubmitting.value = true
      ${data_request.value.type}('${data_request.value.url}', formData.value, true)
        .then(() => {
          display.value = false
          emit('refreshCb')
        })
        .catch(() => {})
        .finally(() => {
          isSubmitting.value = false
        })
    }
  })
}

</`
  code += 'script>'

  return code
}

const dialogTitle = ref('修改xxx')

const formData = {
  //获取数据函数
  add: (item) => {
    const template = {
      must: false,
      placeholder: '',
      title: '',
      field: '', // 请求字段名
      typeTitle: item.text,
      type: item.value,
      min: 0, // 最小值、最小长度
      max: 0, // 最大值、最大长度
      defaultVal: '', // 默认值
      // limit: '', //限制的值
      isMore: false, // 是否在更多中显示
      select: {
        type: 'code', // code或url
        dataFromCode: 'key=value&key2=value2', // 下拉列表本地数据 label,value
        dataFromUrl: '', // 下拉列表数据来源
        dataFromField: '', // 下拉列表数据来源字段
        fieldLabel: '',
        fieldValue: '',
      },
      rule: [],
      color: item.color,
    }

    if (item.value === 6) {
      template.defaultVal = false
    }

    data_search.push(template)
  },
  remove: (index) => {
    data_search.splice(index, 1)
  },
}

// 搜索请求 -----------------------------------------------------------------------------------------
const data_request = ref({
  type: 'http_post',
  url: '/test/users',
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
