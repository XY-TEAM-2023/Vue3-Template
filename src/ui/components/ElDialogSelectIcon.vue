<template>
  <el-dialog
    v-model="isShow"
    :title="$t(props.title)"
    :width="width"
    :close-on-click-modal="false"
    :autofocus="false"
    @close="onClose"
    @cancel="onClose"
    style="margin-top: 20vh"
    class="unselect"
  >
    <el-tabs v-model="selectTab" type="card" class="demo-tabs">
      <!--   Element默认图标   -->
      <el-tab-pane label="element1" name="element">
        <div style="display: block">
          <el-input-search v-model="elSearch" width="237" class="search-input" @search="onSearch" />
        </div>

        <div class="line" style="margin-left: 10px; margin-right: 10px" />
        <el-scrollbar class="icon-box">
          <div class="icon-container">
            <div
              v-for="icon in searchIcons.length > 0 ? searchIcons : elementIcons"
              :key="icon"
              class="icon-item"
              v-bind:class="{ 'icon-item-select': elementIcon === icon }"
              @click="onSelectElement(icon)"
            >
              <component :is="icon" class="icon-item-icon" />
              <div class="icon-item-text">
                {{ icon }}
              </div>
            </div>
          </div>
        </el-scrollbar>
      </el-tab-pane>
      <!--   自定义svg图标   -->
      <el-tab-pane label="svg2" name="svg">
        <el-link href="https://www.iconfont.cn/search/index?searchType=icon&page=1&fromCollection=1" target="_blank">
          <el-icon style="margin-right: 4px"><Eleme /></el-icon>
          iconfont website
        </el-link>
        <el-input v-model="svgIcon" :rows="10" :autosize="false" type="textarea" :placeholder="svgTip" style="margin-top: 10px" />
      </el-tab-pane>
    </el-tabs>

    <!--  图标预览  -->
    <div class="svg-box">
      <component v-if="selectTab === 'element'" :is="elementIcon" />
      <ui-svg v-else-if="selectTab === 'svg'" size="24px" :svg-code="svgIcon" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">
          {{ $t('com.btnCancel') }}
        </el-button>

        <el-button type="primary" @click="onsubmit">
          {{ $t('com.btnSubmit') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineEmits, reactive, ref, watch } from 'vue'
import { config } from '@/config'
import ElInputSearch from '@/ui/components/ElInput/ElInputSearch.vue'
import UiSvg from '@/ui/components/UiSvg.vue'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Title',
  },
  // 每行显示数量
  rowCount: {
    type: Number,
    default: 6,
  },
  // 输入框相关
  defaultIcon: [String, Array],
  onSubmit: Function,
})

const width = ref(781)
const selectTab = ref('element')
const emit = defineEmits(['close', 'submit'])
const elementIcon = ref('')
const svgIcon = ref('')

const isShow = ref(props.isShow)
/* 实现外部修改了变量，内部同步变化 */
watch(
  () => [props.isShow, props.defaultIcon, props.rowCount],
  ([newIsShow, newDefaultIcon, newRowCount], [oldIsShow, oldDefaultIcon, oldRowCount]) => {
    // console.log(newDefaultIcon)
    if (newIsShow !== oldIsShow) {
      isShow.value = newIsShow
    }
    if (newDefaultIcon !== oldDefaultIcon) {
      if (Array.isArray(newDefaultIcon) || newDefaultIcon.includes('.')) {
        svgIcon.value = newDefaultIcon
        elementIcon.value = ''
        selectTab.value = 'svg'
      } else {
        svgIcon.value = ''
        elementIcon.value = newDefaultIcon
        selectTab.value = 'element'
      }
    }
    if (newRowCount !== oldRowCount) {
      width.value = 64 + 120 * newRowCount
    }
  },
  { deep: true }
)

const svgTip = `<svg t="1703745451126" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7480" width="32" height="32"><path d="M839.4 270.3c0 36.1-12.5 71-37.4 104.5-17.2 22.4-44.3 49.5-81.3 81.3-38.7 33.5-63.7 57.6-74.8 72.2-17.2 24.1-25.8 47.3-25.8 69.7 0 6.9 0.4 12 1.3 15.5l3.9 24.5h-218l-2.6-16.8c-2.6-12.9-3.9-25.8-3.9-38.7 0-36.1 10.8-70.5 32.3-103.2 11.2-16.3 23.9-31.6 38-45.8s32.5-31.2 54.8-51c25.8-23.2 45.1-42.6 58-58 12.9-15.5 19.4-30.1 19.4-43.9 0-22.4-9.3-38.5-27.7-48.4-18.5-9.9-41.1-14.8-67.7-14.8-18.9 0-48.6 7.8-89 23.2-25.8 11.2-55.5 28.4-89 51.6L317 303.8 209.9 177.4l20.6-18.1c35.3-31 74.8-55.9 118.7-74.8C406 61.3 467.5 49.7 533.7 49.7c95.5 0 170.3 19.6 224.5 58.7 54.1 39.2 81.2 93.1 81.2 161.9zM648.5 850.8c0 35.3-12.7 64.7-38.1 88.4-25.4 23.6-57 35.5-94.8 35.5s-69.7-11.8-95.5-35.5c-25.8-23.7-38.7-53.1-38.7-88.4 0-35.3 12.9-64.9 38.7-89 25.8-24.1 57.6-36.1 95.5-36.1 37.8 0 69.4 12 94.8 36.1s38.1 53.8 38.1 89z" p-id="7481"></path></svg>`

const elementIcons = ref(reactive(config.elementPlusIconNames))
const elSearch = ref('')
const searchIcons = ref(reactive([]))
function onSearch() {
  searchIcons.value = []
  const search = elSearch.value.toLowerCase()
  elementIcons.value.forEach((item) => {
    if (item.toLowerCase().includes(search)) {
      searchIcons.value.push(item)
    }
  })
  console.log(searchIcons.value)
}

const onClose = () => {
  isShow.value = false
  emit('close')
}

const onsubmit = () => {
  if (!props.onSubmit) {
    return
  }

  if (selectTab.value === 'element') {
    props.onSubmit('element', elementIcon.value)
  } else if (selectTab.value === 'svg') {
    props.onSubmit('svg', svgIcon.value)
  }
}

const selectElement = ref('')
function onSelectElement(icon) {
  const index = elementIcons.value.indexOf(icon)
  elementIcon.value = elementIcons.value[index]
  selectElement.value = elementIcons.value[index]
}
</script>
<style scoped>
.search-input {
  margin-left: 10px;
  margin-bottom: 10px;
}

.icon-box {
  padding-left: 10px;
  padding-right: 10px;
  height: 30vh;
}

.icon-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  border-left: 1px solid var(--el-border-color);
  //background-color: #007aff;
}

.icon-item {
  display: flex;
  width: 120px;
  height: 80px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 10px;
  border-right: 1px solid var(--el-border-color);
  border-bottom: 1px solid var(--el-border-color);
}
.icon-item-icon {
  width: 23px;
  height: 23px;
}
.icon-item-text {
  margin-top: 8px;
  font-size: 13px;
}
.icon-item-select {
  background-color: #ffea89;
}
.icon-item:hover {
  background-color: #fef6d5;
}

.line {
  border-bottom: 1px solid var(--el-border-color);
}

.svg-box {
  position: absolute;
  top: 62px;
  right: 20px;
  width: 30px;
  height: 30px;
  color: #000000;
}
</style>
