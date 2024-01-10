<template>
  <div class="unselect">
    <el-collapse v-model="activeName">
      <!--   页面配置   -->
      <el-collapse-item title="页面配置" name="1">
        <el-form :model="data_page" label-width="70" :lnline="true">
          <el-form-item label="父目录">
            <el-input v-model="data_page.dir" placeholder="相对 src/ui/views/desktop 目录，比如: 'user'。可空" clearable />
          </el-form-item>

          <el-form-item label="页面名">
            <el-input v-model="data_page.view" placeholder="最终生成的页面名，比如: 'LoginView'" clearable />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="searchData.check">提交请求</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>

      <!--   路由配置   -->
      <el-collapse-item title="路由配置" name="2">
        <el-form :model="data_route" label-width="100" :lnline="true">
          <el-form-item label="父菜单">
            <el-input
              v-model="data_route.parent"
              placeholder="指定当前页面置于哪个菜单下，对应asyncRoutes.js中路由的name字段。可空"
              clearable
            />
          </el-form-item>

          <el-form-item label="菜单标识">
            <el-input v-model="data_route.config.name" placeholder="对应name字段，只可以使用特殊字符 “-”" clearable />
          </el-form-item>

          <el-form-item label="菜单标题">
            <el-input v-model="data_route.config.meta.title.zh" class="input-view-title" placeholder="中文（必填）" clearable />
            <el-input v-model="data_route.config.meta.title.en" class="input-view-title" placeholder="英文（选填）" clearable />
            <el-input v-model="data_route.config.meta.title.ko" class="input-view-title" placeholder="韩文（选择）" clearable />
          </el-form-item>

          <el-form-item label="图标"> </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="searchData.check">提交请求</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>

      <!--   页面功能   -->
      <el-collapse-item title="页面功能" name="3">
        <!--   筛选条件   -->
        <el-card-ex shadow="never">
          <template #header> 筛选条件 </template>

          <template #default>
            <!--  添加搜索字段  -->
            <el-form-item label="添加搜索" label-width="80">
              <el-button-group>
                <el-button v-for="item in searchDataTypeList" :key="item.value" type="primary" @click="searchData.add(item)">
                  {{ item.text }}
                </el-button>
              </el-button-group>
            </el-form-item>

            <!--  添加的搜索条件  -->
            <el-form label-position="top">
              <div style="padding-left: 80px">
                <VueDraggable ref="el" v-model="data_search" style="display: flex; flex-direction: column; row-gap: 8px">
                  <template v-for="(item, index) in data_search" :key="index">
                    <!--  文本类型  -->
                    <el-card-ex v-if="item.type === 1" :use-fold="true" shadow="never" style="height: 86px">
                      <div style="display: flex; column-gap: 16px">
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

                        <el-form-item label="高级">
                          <el-switch
                            v-model="item.isMore"
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
                          <el-button type="danger" :icon="Delete" circle @click="searchData.remove(index)" />
                        </div>
                      </div>
                    </el-card-ex>

                    <!--  小数  -->
                    <el-card-ex v-if="item.type === 3" :enable-fold="true" shadow="never" style="height: 86px">
                      <div style="display: flex; column-gap: 16px">
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

                        <el-form-item label="高级">
                          <el-switch
                            v-model="item.isMore"
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
                          <el-button type="danger" :icon="Delete" circle @click="searchData.remove(index)" />
                        </div>
                      </div>
                    </el-card-ex>

                    <!--  整数  -->
                    <el-card-ex v-if="item.type === 4" :enable-fold="true" shadow="never" style="height: 86px">
                      <div style="display: flex; column-gap: 16px">
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

                        <el-form-item label="高级">
                          <el-switch
                            v-model="item.isMore"
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
                          <el-input v-model="item.defaultVal" style="width: 100px" />
                        </el-form-item>

                        <el-form-item label="提示文本" style="width: 100%">
                          <el-input v-model="item.placeholder" style="min-width: 100px" />
                        </el-form-item>

                        <div style="margin-top: 30px">
                          <el-button type="danger" :icon="Delete" circle @click="searchData.remove(index)" />
                        </div>
                      </div>
                    </el-card-ex>

                    <!--  选择框  -->
                    <el-card-ex v-if="item.type === 5" :enable-fold="true" shadow="never" style="height: 86px">
                      <div style="display: flex; column-gap: 16px">
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

                        <el-form-item label="高级">
                          <el-switch
                            v-model="item.isMore"
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
                            <el-input v-model="item.dataFromUrl" placeholder="格式：key=value&key2=value2" style="width: 500px" />
                          </el-form-item>
                        </template>

                        <template v-if="item.select.type === 'url'">
                          <el-form-item label="数据来源-地址" :required="true">
                            <el-input v-model="item.dataFromUrl" placeholder="/role/list" style="width: 220px" />
                          </el-form-item>

                          <el-form-item label="数据来源-字段" :required="true">
                            <el-input v-model="item.dataFromField" placeholder="roles.list" style="width: 160px" />
                          </el-form-item>
                        </template>

                        <el-form-item label="提示文本" style="width: 100%">
                          <el-input v-model="item.placeholder" style="min-width: 100px" />
                        </el-form-item>

                        <div style="margin-top: 30px">
                          <el-button type="danger" :icon="Delete" circle @click="searchData.remove(index)" />
                        </div>
                      </div>
                    </el-card-ex>

                    <!--  逻辑值  -->
                    <el-card-ex v-if="item.type === 6" :enable-fold="true" shadow="never" style="height: 86px">
                      <div style="display: flex; column-gap: 16px">
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

                        <el-form-item label="高级">
                          <el-switch
                            v-model="item.isMore"
                            inline-prompt
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #cdd0d7"
                          />
                        </el-form-item>

                        <el-form-item label="默认值" style="min-width: 55px">
                          <el-checkbox v-model="item.defaultVal" />
                        </el-form-item>

                        <el-form-item label="提示文本" style="width: 100%">
                          <el-input v-model="item.placeholder" style="min-width: 100px" />
                        </el-form-item>

                        <div style="margin-top: 30px">
                          <el-button type="danger" :icon="Delete" circle @click="searchData.remove(index)" />
                        </div>
                      </div>
                    </el-card-ex>

                    <!--  时间区间  -->
                    <el-card-ex v-if="item.type === 2" :enable-fold="true" shadow="never" style="height: 86px">
                      <div style="display: flex; column-gap: 16px">
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

                        <el-form-item label="高级">
                          <el-switch
                            v-model="item.isMore"
                            inline-prompt
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #cdd0d7"
                          />
                        </el-form-item>

                        <el-form-item label="提示文本" style="width: 100%">
                          <el-input v-model="item.placeholder" style="min-width: 100px" />
                        </el-form-item>

                        <div style="margin-top: 30px">
                          <el-button type="danger" :icon="Delete" circle @click="searchData.remove(index)" />
                        </div>
                      </div>
                    </el-card-ex>

                    <!--  指定时间  -->
                    <el-card-ex v-if="item.type === 7" :enable-fold="true" shadow="never" style="height: 86px">
                      <div style="display: flex; column-gap: 16px">
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

                        <el-form-item label="高级">
                          <el-switch
                            v-model="item.isMore"
                            inline-prompt
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #cdd0d7"
                          />
                        </el-form-item>

                        <el-form-item label="提示文本" style="width: 100%">
                          <el-input v-model="item.placeholder" style="min-width: 100px" />
                        </el-form-item>

                        <div style="margin-top: 30px">
                          <el-button type="danger" :icon="Delete" circle @click="searchData.remove(index)" />
                        </div>
                      </div>
                    </el-card-ex>
                  </template>
                </VueDraggable>
              </div>
            </el-form>
          </template>
        </el-card-ex>

        <!--   表格显示   -->
        <el-card-ex shadow="never" style="margin-top: 10px">
          <template #header> 表格显示 </template>

          <template #default>
            <!--  添加搜索字段  -->
            <el-form-item label="添加列" label-width="80">
              <el-button-group>
                <el-button v-for="item in tableDataTypeList" :key="item.value" type="primary" @click="tableData.add(item)">
                  {{ item.text }}
                </el-button>
              </el-button-group>
            </el-form-item>

            <!--  添加的搜索条件  -->
            <div style="padding-left: 80px">
              <VueDraggable ref="el" v-model="data_table" style="display: flex; flex-direction: column; row-gap: 8px">
                <template v-for="(item, index) in data_table" :key="index">
                  <!--  文本类型  -->
                  <el-card-ex :use-fold="true" shadow="never">
                    <el-form label-position="left" style="height: 30px">
                      <div style="display: flex; column-gap: 20px">
                        <el-form-item label="标题" :required="true">
                          <el-input v-model="item.title" placeholder="*标题" style="width: 140px" />
                        </el-form-item>

                        <el-form-item label="参数名" :required="true">
                          <el-input v-model="item.field" placeholder="title" style="width: 140px" />
                        </el-form-item>

                        <!--  数据类型  -->
                        <el-form-item label="">
                          <div style="height: 100%">
                            <el-tag :color="item.color" style="color: #f1f3f7; font-weight: normal; min-width: 80px">
                              {{ item.typeTitle }}
                            </el-tag>
                          </div>
                        </el-form-item>

                        <!--  对齐方式  -->
                        <el-form-item label="对齐方式">
                          <el-radio-group v-model="item.align" style="width: 240px">
                            <el-radio-button label="left">左对齐</el-radio-button>
                            <el-radio-button label="center">居中对齐</el-radio-button>
                            <el-radio-button label="right">右对齐</el-radio-button>
                          </el-radio-group>
                        </el-form-item>

                        <el-form-item label="可编辑">
                          <el-switch
                            v-model="item.canEdit"
                            inline-prompt
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #cdd0d7"
                          />
                        </el-form-item>

                        <el-button type="danger" :icon="Delete" circle @click="searchData.remove(index)" />
                      </div>
                    </el-form>
                  </el-card-ex>
                </template>
              </VueDraggable>
            </div>
          </template>
        </el-card-ex>
        <el-button type="primary" @click="searchData.check">提交请求</el-button>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import ElCardEx from '@/ui/components/ElCardEx.vue'
import ElInputFloat from '@/ui/components/ElInputFloat.vue'
import { VueDraggable } from 'vue-draggable-plus'

const size = 'default'
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
  { text: '指定天', value: 7, color: '#003371' },
]

const data_search = reactive([])

const searchData = {
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
        dataFromCode: [], // 下拉列表本地数据 label,value
        dataFromUrl: '', // 下拉列表数据来源
        dataFromField: '', // 下拉列表数据来源字段
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
  check: () => {
    console.log(data_search.value)
    let nowData = {}
    for (let item of data_search) {
      if (!item.key.length) {
        ElMessage({
          message: '参数名不能为空',
          type: 'warning',
        })
        return
      }
      item.key.forEach((keyItem, keyIndex) => {
        nowData[keyItem] = item.content[keyIndex]
        if (item.type == 6 && item.content[keyIndex] != true) {
          nowData[keyItem] = false
        }
        if (
          (item.type == 1 && item.rule.length && (item.rule[1] < nowData[keyItem].length || item.rule[0] > nowData[keyItem].length)) ||
          (item.type == 2 && !item.content.length) ||
          ([3, 4, 5].includes(item.type) && item.rule[1] < nowData[keyItem]) ||
          item.rule[0] > nowData[keyItem]
        ) {
          ElMessage({
            message: `有${item.text}型参数为不合法参数`,
            type: 'warning',
          })
          return
        }
      })
    }
    console.log(nowData)
    proxy.$axios
      .req(form, nowData)
      .then((res) => {
        //请求成功
        console.log(res)
        tableData = res.data
      })
      .catch((err) => {
        console.log(err)
      })
  },
}

// 表格显示相关 -----------------------------------------------------------------------------------------

/** 表格数据支持的数据类型 */
const tableDataTypeList = [
  { text: '文本', value: 1, color: '#2c3e50' },
  { text: '整数', value: 2, color: '#6b6882' },
  { text: '小数', value: 3, color: '#0eb83a' },
  { text: '货币', value: 4, color: '#0eb83a' },
  { text: '逻辑型', value: 5, color: '#c32136' },
  { text: '时间戳', value: 6, color: '#ac4fb6' },
]

const data_table = reactive([])
const tableData = {
  //获取数据函数
  add: (item) => {
    const template = {
      title: '',
      field: '', // 请求字段名
      typeTitle: item.text,
      type: item.value,
      color: item.color,
      align: 'left', // 对齐方式
      canEdit: false, // 是否可以编辑
    }
    data_table.push(template)
  },
  remove: (index) => {
    data_table.splice(index, 1)
  },
  check: () => {},
}
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
