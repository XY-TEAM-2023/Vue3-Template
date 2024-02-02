<template>
  <div class="unselect">
    <el-collapse v-model="activeName">
      <!--   页面配置   -->
      <el-collapse-item v-if="false" title="页面配置" name="1">
        <el-form :model="data_page" label-width="70" :lnline="true">
          <el-form-item label="父目录">
            <el-input v-model="data_page.dir" placeholder="相对 src/ui/views/desktop 目录，比如: 'user'。可空" clearable />
          </el-form-item>

          <el-form-item label="页面名">
            <el-input v-model="data_page.view" placeholder="最终生成的页面名，比如: 'LoginView'" clearable />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="searchData.genCode">提交请求</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>

      <!--   路由配置   -->
      <el-collapse-item v-if="false" title="路由配置" name="2">
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
            <el-button type="primary" @click="searchData.genCode">提交请求</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>

      <!--   页面功能   -->
      <!--      <el-collapse-item title="页面功能" name="3">-->
      <!--   请求定义   -->
      <el-card-ex>
        <template #header> 请求定义 </template>

        <el-form :model="data_searchRequest" label-position="top" :inline="true">
          <el-form-item label="请求类型">
            <el-select-local
              style="width: 100px"
              v-model="data_searchRequest.type"
              :options="[
                { label: 'POST', value: 'http_post' },
                { label: 'GET', value: 'http_get' },
              ]"
            />
          </el-form-item>

          <el-form-item label="请求地址">
            <el-input-label style="width: 200px" v-model="data_searchRequest.url" :clearable="true" />
          </el-form-item>

          <el-form-item label="数据字段名">
            <el-input-label style="width: 150px" v-model="data_searchRequest.tableDataField" />
          </el-form-item>

          <el-form-item label="分页查询">
            <el-switch v-model="data_searchRequest.isPage" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
          </el-form-item>
        </el-form>
      </el-card-ex>

      <!--   筛选条件   -->
      <el-card-ex shadow="never" style="margin-top: 10px">
        <template #header> 筛选条件 </template>

        <template #default>
          <!--  添加的搜索条件  -->
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
                            <el-input v-model="item.dataFromCode" placeholder="格式：key=value&key2=value2" style="width: 500px" />
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

                        <!--                        <el-form-item label="提示文本" style="width: 100%">-->
                        <!--                          <el-input v-model="item.placeholder" style="min-width: 100px" />-->
                        <!--                        </el-form-item>-->

                        <div style="margin-top: 30px; margin-left: auto">
                          <el-button type="danger" :icon="Delete" circle @click="searchData.remove(index)" />
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
              <el-button v-for="item in searchDataTypeList" :key="item.value" type="primary" @click="searchData.add(item)">
                {{ item.text }}
              </el-button>
            </el-button-group>

            <el-button style="margin-left: 10px" type="danger" @click="data_search.splice(0, data_search.length)">清空</el-button>
          </el-form-item>
        </template>
      </el-card-ex>

      <!--   表格显示   -->
      <el-card-ex shadow="never" style="margin-top: 10px">
        <template #header> 表格显示 </template>

        <template #default>
          <!--  添加的搜索条件  -->
          <div style="padding-left: 80px">
            <template v-for="(item, index) in data_table" :key="index">
              <!--  文本类型  -->
              <el-card-ex :use-fold="true" shadow="never">
                <el-form label-position="top">
                  <el-scrollbar>
                    <div style="display: flex; column-gap: 20px; height: 64px">
                      <el-form-item label="标题" :required="true">
                        <el-input v-model="item.title" placeholder="*标题" style="width: 120px" clearable />
                      </el-form-item>

                      <el-form-item label="参数名" :required="true">
                        <el-input v-model="item.field" placeholder="title" style="width: 120px" clearable />
                      </el-form-item>

                      <!--  数据类型  -->
                      <el-form-item label="数据类型">
                        <div style="height: 100%">
                          <el-tag :color="item.color" style="color: #f1f3f7; font-weight: normal; min-width: 80px">
                            {{ item.typeTitle }}
                          </el-tag>
                        </div>
                      </el-form-item>

                      <!--  对齐方式  -->
                      <el-form-item label="对齐方式">
                        <el-radio-group v-model="item.align" style="width: 136px">
                          <el-radio-button label="left">左</el-radio-button>
                          <el-radio-button label="center">中</el-radio-button>
                          <el-radio-button label="right">右</el-radio-button>
                        </el-radio-group>
                      </el-form-item>

                      <el-form-item label="可修改">
                        <el-switch
                          v-model="item.canEdit"
                          inline-prompt
                          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #cdd0d7; width: 55px"
                        />
                      </el-form-item>

                      <template v-if="item.canEdit">
                        <el-form-item label="请求地址" :required="true">
                          <el-input v-model="item.editUrl" placeholder="/user/edit/name" style="width: 140px" clearable />
                        </el-form-item>
                        <el-form-item label="主键字段名" :required="true">
                          <el-input v-model="item.reqMainField" placeholder="id" style="width: 100px" clearable />
                        </el-form-item>
                        <el-form-item label="更新字段名" :required="true">
                          <el-input v-model="item.reqValueField" placeholder="id" style="width: 100px" clearable />
                        </el-form-item>
                      </template>
                      <div style="margin-top: 30px">
                        <el-button type="danger" :icon="Delete" circle @click="tableData.remove(index)" />
                      </div>
                    </div>
                  </el-scrollbar>
                </el-form>
              </el-card-ex>
            </template>
          </div>

          <!--  添加搜索字段  -->
          <el-form-item label="添加列" label-width="80">
            <el-button-group>
              <el-button v-for="item in tableDataTypeList" :key="item.value" type="primary" @click="tableData.add(item)">
                {{ item.text }}
              </el-button>
            </el-button-group>

            <el-button style="margin-left: 10px" type="danger" @click="data_table.splice(0, data_table.length)">清空</el-button>
          </el-form-item>
        </template>
      </el-card-ex>

      <el-button type="primary" @click="copyCode" style="margin-top: 10px"> 复制代码 </el-button>

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
// const data_search = reactive([
//   {
//     // 是否必填
//     must: false,
//     // 备注
//     placeholder: '指定日期2',
//     // 标题
//     title: '指定日期',
//     // 字段名
//     field: 'date',
//     // 字段类型标题
//     typeTitle: '指定日期',
//     //
//     type: 7,
//     min: 0,
//     max: 0,
//     defaultVal: '',
//     isMore: false,
//     select: {
//       type: 'code',
//       dataFromCode: 'key=value&key2=value2',
//       dataFromUrl: '',
//       dataFromField: '',
//     },
//     rule: [],
//     color: '#003371',
//   },
//   {
//     must: false,
//     placeholder: '指定日期时间2',
//     title: '指定日期时间',
//     field: 'datetime',
//     typeTitle: '指定日期时间',
//     type: 8,
//     min: 0,
//     max: 0,
//     defaultVal: '',
//     isMore: false,
//     select: {
//       type: 'code',
//       dataFromCode: 'key=value&key2=value2',
//       dataFromUrl: '',
//       dataFromField: '',
//     },
//     rule: [],
//     color: '#003371',
//   },
//   {
//     must: false,
//     placeholder: '文本型2',
//     title: '文本型',
//     field: 'str',
//     typeTitle: '文本型',
//     type: 1,
//     min: 10,
//     max: 20,
//     defaultVal: '',
//     isMore: false,
//     select: {
//       type: 'code',
//       dataFromCode: 'key=value&key2=value2',
//       dataFromUrl: '',
//       dataFromField: '',
//     },
//     rule: [],
//     color: '#2c3e50',
//     RuleBol: true,
//   },
//   {
//     must: false,
//     placeholder: '整数型2',
//     title: '整数型',
//     field: 'int',
//     typeTitle: '整数型',
//     type: 4,
//     min: 10,
//     max: 20,
//     defaultVal: '',
//     isMore: false,
//     select: {
//       type: 'code',
//       dataFromCode: 'key=value&key2=value2',
//       dataFromUrl: '',
//       dataFromField: '',
//     },
//     rule: [],
//     color: '#6b6882',
//     RuleBol: true,
//   },
//   {
//     must: false,
//     placeholder: '小数型2',
//     title: '小数型',
//     field: 'float',
//     typeTitle: '小数型',
//     type: 3,
//     min: '10',
//     max: '20',
//     defaultVal: '',
//     isMore: false,
//     select: {
//       type: 'code',
//       dataFromCode: 'key=value&key2=value2',
//       dataFromUrl: '',
//       dataFromField: '',
//     },
//     rule: [],
//     color: '#0eb83a',
//     RuleBol: true,
//   },
//   {
//     must: false,
//     placeholder: '',
//     title: '选择框',
//     field: 'selelct',
//     typeTitle: '选择框',
//     type: 5,
//     min: 0,
//     max: 0,
//     defaultVal: '',
//     isMore: false,
//     select: {
//       type: 'code',
//       dataFromCode: 'key=value&key2=value2',
//       dataFromUrl: '',
//       dataFromField: '',
//     },
//     rule: [],
//     color: '#ac4fb6',
//     dataFromCode: 'key1=value1&key2=value2',
//   },
//   {
//     must: false,
//     placeholder: '',
//     title: '逻辑型',
//     field: 'bool',
//     typeTitle: '逻辑型',
//     type: 6,
//     min: 0,
//     max: 0,
//     defaultVal: false,
//     isMore: false,
//     select: {
//       type: 'code',
//       dataFromCode: 'key=value&key2=value2',
//       dataFromUrl: '',
//       dataFromField: '',
//     },
//     rule: [],
//     color: '#c32136',
//   },
//   {
//     must: false,
//     placeholder: '',
//     title: '选择框-server',
//     field: 'selectServer',
//     typeTitle: '选择框',
//     type: 5,
//     min: 0,
//     max: 0,
//     defaultVal: '',
//     isMore: false,
//     select: {
//       type: 'url',
//       dataFromCode: 'key=value&key2=value2',
//       dataFromUrl: '/test/options',
//       dataFromField: 'options',
//     },
//     rule: [],
//     color: '#ac4fb6',
//   },
//   {
//     must: false,
//     placeholder: '时间区间2',
//     title: '时间区间',
//     field: 'timeRange',
//     typeTitle: '时间区间',
//     type: 2,
//     min: 0,
//     max: 0,
//     defaultVal: '',
//     isMore: false,
//     select: {
//       type: 'url',
//       dataFromCode: 'key=value&key2=value2',
//       dataFromUrl: '/test/options',
//       dataFromField: 'options',
//     },
//     rule: [],
//     color: '#ff7500',
//   },
// ])

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
  const code = genCode()
  navigator.clipboard
    .writeText(code)
    .then(() => {
      ElMessage({
        message: '复制成功',
        type: 'success',
      })
    })
    .catch((err) => {})
}

function genCode() {
  let temp_search_data_list = ''
  // 搜索参数定义
  let temp_searchDataDefine = ''
  let code_searchData = ''
  let code_boolFieldsReset = ''
  let code_tableEvents = ''

  if (data_search.length > 0) {
    data_search.forEach((field) => {
      temp_searchDataDefine += `
  /** ${field.title} */
  ${field.field}: ${field.defaultVal ? field.defaultVal : undefined},`

      if (field.type === 1) {
        // 文本
        temp_search_data_list += `
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-label
            label="${field.title}"
            v-model="searchData.${field.field ? field.field : '???'}"
            prop="${field.field}"
            :placeholder="${field.placeholder !== '' ? "'" + field.placeholder + "'" : null}"
            :maxlength="${field.max > 0 ? field.max : null}"
            clearable
          />
        </el-col>`
      } else if (field.type === 4) {
        // 整数
        temp_search_data_list += `
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-integer
            label="${field.title}"
            v-model="searchData.${field.field ? field.field : '???'}"
            prop="${field.field}"
            :placeholder="${field.placeholder !== '' ? "'" + field.placeholder + "'" : null}"
            :max="${field.max > 0 ? field.max : null}"
            clearable
          />
        </el-col>`
      } else if (field.type === 3) {
        // 小数
        temp_search_data_list += `
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-float
            label="${field.title}"
            v-model="searchData.${field.field ? field.field : '???'}"
            prop="${field.field}"
            :placeholder="${field.placeholder !== '' ? "'" + field.placeholder + "'" : null}"
            :min='${field.min ? field.min : null}'
            :max="${field.max ? field.max : null}"
            clearable
          />
        </el-col>`
      } else if (field.type === 5) {
        // 选择框
        if (field.select.type === 'code') {
          let options = field.select.dataFromCode
          if (options.includes('=')) {
            options = parseQueryString(options)
          }

          temp_search_data_list += `
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-select-local
            label="${field.title}"
            v-model="searchData.${field.field ? field.field : '???'}"
            :options='${options}'
            prop="${field.field}"
            :placeholder="${field.placeholder !== '' ? "'" + field.placeholder + "'" : null}"
            clearable
          />
        </el-col>`
        } else if (field.select.type === 'url') {
          temp_search_data_list += `
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-select-server
            label="${field.title}"
            v-model="searchData.${field.field ? field.field : '???'}"
            prop="${field.field}"
            url="${field.select.dataFromUrl}"
            field="${field.select.dataFromField}"
            :placeholder="${field.placeholder !== '' ? "'" + field.placeholder + "'" : null}"
            clearable
          />
        </el-col>`
        }
      } else if (field.type === 6) {
        // 逻辑型
        code_boolFieldsReset += `
  searchData.value.${field.field}= ${field.defaultVal ? field.defaultVal : 'false'}`
        temp_search_data_list += `
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-checkbox label="${field.title}" v-model="searchData.${field.field ? field.field : '???'}" />
        </el-col>`
      } else if (field.type === 2) {
        // 时间区间
        temp_search_data_list += `
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-date-range
            label="${field.title}"
            v-model="searchData.${field.field ? field.field : '???'}"
            prop="${field.field}"
            :placeholder="${field.placeholder !== '' ? "'" + field.placeholder + "'" : null}"
            clearable
          />
        </el-col>`
      } else if (field.type === 7) {
        // 指定日期
        temp_search_data_list += `
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-date
            label="${field.title}"
            v-model="searchData.${field.field ? field.field : '???'}"
            prop="${field.field}"
            :placeholder="${field.placeholder !== '' ? "'" + field.placeholder + "'" : null}"
            clearable
          />
        </el-col>`
      } else if (field.type === 8) {
        // 指定日期事件
        temp_search_data_list += `
        <el-col :lg="4" :md="8" :sm="12" :xs="24">
          <el-form-item-date-time
            label="${field.title}"
            v-model="searchData.${field.field ? field.field : '???'}"
            prop="${field.field}"
            :placeholder="${field.placeholder !== '' ? "'" + field.placeholder + "'" : null}"
            clearable
          />
        </el-col>`
      }
    })

    code_searchData = `
  <el-card-ex :use-fold="true" shadow="never">
    <template #header> {{ $t('app.searchParamsTitle') }} </template>
    <el-form ref="searchDataRef" :model="searchData" label-position="top">
      <el-row :gutter="24">
${temp_search_data_list}
      </el-row>
    </el-form>

    <template #footer>
      <div style="display: flex; margin-left: auto">
        <el-button type="warning" @click="onResetSearch" style="width: 100px"> {{ $t('com.btnReset') }} </el-button>
        <el-button type="primary" @click="${
          data_searchRequest.value.isPage ? 'onSearch' : 'requestSearch'
        }" style="width: 100px"> {{ $t('com.btnSearch') }} </el-button>
      </div>
    </template>
  </el-card-ex>`
  }

  let code_tableFields = `
      <el-table-column-index label="com.index" width="80" align="center" />`
  let code_table = ''
  data_table.forEach((field) => {
    let temp_edit_fun_name = ''
    let temp_edit = ''
    if (field.canEdit) {
      temp_edit_fun_name = `onEdit${field.field.charAt(0).toUpperCase() + field.field.slice(1)}`
      temp_edit = ` can-edit @edit="tableEvents.${temp_edit_fun_name}"`
    }

    if (field.type === 1) {
      // 文本
      code_tableFields += `
      <el-table-column-label label="${field.title}" prop="${field.field}" align="${field.align}" ${temp_edit} />`
    } else if (field.type === 2) {
      // 整数
      code_tableFields += `
      <el-table-column-integer label="${field.title}" prop="${field.field}" align="${field.align}" ${temp_edit} />`
    } else if (field.type === 3) {
      // 小数
      code_tableFields += `
      <el-table-column-float label="${field.title}" prop="${field.field}" align="${field.align}" ${temp_edit} />`
    } else if (field.type === 4) {
      // 金钱
      code_tableFields += `
      <el-table-column-money label="${field.title}" prop="${field.field}" align="${field.align}" ${temp_edit} />`
    } else if (field.type === 5) {
      // 逻辑型
      code_tableFields += `
      <el-table-column-switch label="${field.title}" prop="${field.field}" align="${field.align}" ${temp_edit} />`
    } else if (field.type === 6) {
      //时间戳
      code_tableFields += `
      <el-table-column-timestamp label="${field.title}" prop="${field.field}" align="${field.align}" ${temp_edit} width='160' />`
    } else if (field.type === 7) {
      //时间戳
      code_tableFields += `
      <el-table-column-link label="${field.title}" prop="${field.field}" align="${field.align}" />`
    } else if (field.type === 8) {
      code_tableFields += `
      <el-table-column-ex label="${field.title}" prop="${field.field}"  align="${field.align}">
        <template #default="scope">
          {{ scope.row.${field.field}}}
        </template>
      </el-table-column-ex>`
    }

    if (temp_edit_fun_name) {
      code_tableEvents += `
  /** 修改${field.title} */
  ${temp_edit_fun_name}: (index, row, newValue, cancelCb, closeCb) => {
    http_post('${field.editUrl}', { ${field.reqMainField}: row.${field.reqMainField}, ${field.reqValueField}: newValue })
      .then(() => {
        requestSearch()
        closeCb()
      })
      .catch(() => {
        cancelCb()
      })
  },`
    }
  })
  if (data_search.length > 0) {
    code_table = `
  <el-card-ex :use-fold="false" shadow="never" style="margin-top: 10px">
    <template #header> {{ $t('app.searchResultTitle') }} </template>

    <el-table-ex
      :data="tableData"
      v-loading='isRequestingSearch'
      :show-pagination="${data_searchRequest.value.isPage}"
      :is-small-pagination="true"${
        !data_searchRequest.value.isPage
          ? ''
          : `
      :current-page="searchPageData.page"
      :page-size="searchPageData.page_size"
      :page-sizes="appStore.pageSizes"
      :total="searchPageData.total"
      @size-change="onPageNumChange"
      @current-change='onPageChange'`
      }
    >
${code_tableFields}
    </el-table-ex>
  </el-card-ex>`
  } else {
    code_table = `
  <el-table-ex
    :data="tableData"
    v-loading='isRequestingSearch'
    :show-pagination="${data_searchRequest.value.isPage}"
    :is-small-pagination="true"${
      !data_searchRequest.value.isPage
        ? ''
        : `
      :current-page="searchPageData.page"
      :page-size="searchPageData.page_size"
      :page-sizes="appStore.pageSizes"
      :total="searchPageData.total"
      @size-change="onPageNumChange"
      @current-change='onPageChange'`
    }
    >
${code_tableFields}
  </el-table-ex>`
  }

  const code_template = `<template>${code_searchData}${code_table}
</template>
`

  let code = `${code_template}

<script setup>
import { reactive, ref } from 'vue'
import ElCardEx from '@/ui/components/ElCardEx.vue'
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
import { getDefaultPageSize, setDefaultPageSize } from '@/utils'
import ElTableEx from '@/ui/components/ElTableEx.vue'
import ElTableColumnLabel from '@/ui/components/ElTable/ElTableColumnLabel.vue'
import ElTableColumnInteger from '@/ui/components/ElTable/ElTableColumnInteger.vue'
import ElTableColumnFloat from '@/ui/components/ElTable/ElTableColumnFloat.vue'
import ElTableColumnMoney from '@/ui/components/ElTable/ElTableColumnMoney.vue'
import ElTableColumnSwitch from '@/ui/components/ElTable/ElTableColumnSwitch.vue'
import ElTableColumnTimestamp from '@/ui/components/ElTable/ElTableColumnTimestamp.vue'
import ElTableColumnIndex from '@/ui/components/ElTable/ElTableColumnIndex.vue'
import ElTableColumnEx from '@/ui/components/ElTable/ElTableColumnEx.vue'
import ElTableColumnLink from '@/ui/components/ElTable/ElTableColumnLink.vue'

const appStore = useAppStore()

/** 搜索Form对象 */
const searchDataRef = ref(null)
/** 搜索数据 */
const searchData = ref({
${temp_searchDataDefine}
})


function onResetSearch() {
  searchDataRef.value.resetFields()
  ${code_boolFieldsReset}
}

/** 是否正在搜索中 */
const isRequestingSearch = ref(false)
/** 表格显示的数据 */
const tableData = ref([])

/** 分页查询数据 */
const searchPageData = ref({
  page: 1,
  page_size: getDefaultPageSize('${data_searchRequest.value.url}'),
  total: 0,
})

/** 搜索 */
function requestSearch() {
  if (isRequestingSearch.value) {
    return
  }
  isRequestingSearch.value = true
  ${data_searchRequest.value.type}('${data_searchRequest.value.url}', ${
    data_searchRequest.value.isPage ? '{ ...searchData.value, ...searchPageData.value }' : '{ ...searchData.value }'
  }, false)
    .then((response) => {
      tableData.value = response.${data_searchRequest.value.tableDataField}
      ${data_searchRequest.value.isPage ? '' : '//'} searchPageData.value.total = response.total
    })
    .catch(() => {})
    .finally(() => {
      isRequestingSearch.value = false
    })
}
${data_search.length > 0 ? '' : 'requestSearch()'}

${
  !data_searchRequest.value.isPage
    ? ''
    : `/** 修改每页显示数量 */
function onPageNumChange(value) {
  searchPageData.value.page_size = value
  setDefaultPageSize('${data_searchRequest.value.url}', value)
  onSearch()
}

/** 搜索按钮事件 */
function onSearch() {
  searchPageData.value.page = 1
  requestSearch()
}

/** 切换页面 */
function onPageChange(value) {
  searchPageData.value.page = value
  requestSearch()
}`
}

/** 表格相关事件 */
const tableEvents = {
${code_tableEvents}
}

</`
  code += 'script>'

  return code
}

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
        dataFromCode: 'key=value&key2=value2', // 下拉列表本地数据 label,value
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
}

// 搜索请求 -----------------------------------------------------------------------------------------
const data_searchRequest = ref({
  type: 'http_post',
  url: '/test/users',
  tableDataField: 'result', // 表格数据字段名
  isPage: false, // 是否分页查询
})

// 表格显示相关 -----------------------------------------------------------------------------------------

/** 表格数据支持的数据类型 */
const tableDataTypeList = [
  { text: '文本', value: 1, color: '#2c3e50' },
  { text: '整数', value: 2, color: '#6b6882' },
  { text: '小数', value: 3, color: '#0eb83a' },
  { text: '金钱', value: 4, color: '#0eb8aa' },
  { text: '逻辑型', value: 5, color: '#c32136' },
  { text: '时间戳', value: 6, color: '#ac4fb6' },
  { text: 'URL地址', value: 7, color: '#1376ab' },
  { text: '自定义', value: 8, color: '#b6ad4f' },
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
      align: 'center', // 对齐方式
      canEdit: false, // 是否可以编辑
      editUrl: '',
      reqMainField: 'id',
      reqValueField: '',
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
