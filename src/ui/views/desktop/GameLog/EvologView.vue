<template class="shadow-effect">
  <div class="div-style2">
    <div>
      <el-form>
        <el-row :gutter="20">
          <el-col :span="8">
            <span class="demonstration">시간범위:</span>
            <el-date-picker
              v-model="value1"
              type="daterange"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              :size="size"
            />
          </el-col>
          <el-col :span="4">
            <el-form-item label="处理状态:">
              <el-select v-model="value" class="m-2" placeholder="Select">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="搜索条件:">
              <el-input placeholder="请输入内容" clearable style="flex-grow: 1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" round>搜索</el-button>
            <el-button round>重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="selection" width="30" />
      <el-table-column fixed prop="date" label="Date" align="center" />
      <el-table-column prop="name" label="Name" align="center" />
      <el-table-column prop="state" label="State" align="center" />
      <el-table-column prop="city" label="City" align="center" />
      <el-table-column prop="address" label="Address" align="center" />
      <el-table-column prop="zip" label="Zip" align="center" />
      <el-table-column fixed="right" label="Operations" align="center">
        <template #default>
          <el-button link type="primary" size="small" @click="handleClick">Detail</el-button>
          <el-button link type="primary" size="small">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElTable } from 'element-plus'

const value = ref('')
const options = [
  {
    value: 'Option1',
    label: '진행중',
  },
  {
    value: 'Option2',
    label: '입금성공',
  },
  {
    value: 'Option3',
    label: '입금반려',
  },
  {
    value: 'Option4',
    label: '승인취소-성공',
  },
  {
    value: 'Option5',
    label: '승인취소-실패',
  },
  {
    value: 'Option6',
    label: '전체기록',
  },
]
const value1 = ref('')
const value2 = ref('')

const handleClick = () => {
  console.log('123')
}

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'Los Angeles',
    zip: 'CA 90036',
  },
]
</script>

<style scoped>
.div-style2 {
  margin-top: 2px;
  margin-left: 2px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
}
</style>
