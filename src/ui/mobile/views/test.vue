<template>
  <div style="background-color: #181818">
    <ui-i18n></ui-i18n>

    <el-popover
      placement="top-start"
      title="Title"
      :width="200"
      trigger="hover"
      content="this is content, this is content, this is content"
    >
      <template #reference>
        <el-button class="m-2">Hover to activate</el-button>
      </template>
    </el-popover>

    <br />
    <br />
    <br />
    <br />
    <br />

    <el-table mb-1 :data="[]" />
    <el-pagination :total="100" />

    <br />
    <p>{{ telWidth }}</p>

    <ui-i18n></ui-i18n>

    <el-popover
      placement="top-start"
      title="Title"
      :width="200"
      trigger="hover"
      content="this is content, this is content, this is content"
    >
      <template #reference>
        <el-button class="m-2">Hover to activate</el-button>
      </template>
    </el-popover>

    <br />

    <el-table mb-1 :data="[]" />
    <el-pagination :total="100" />

    <br />
    <p>{{ telWidth }}</p>
    <ui-i18n></ui-i18n>

    <el-popover
      placement="top-start"
      title="Title"
      :width="200"
      trigger="hover"
      content="this is content, this is content, this is content"
    >
      <template #reference>
        <el-button class="m-2">Hover to activate</el-button>
      </template>
    </el-popover>

    <br />

    <el-table mb-1 :data="[]" />
    <el-pagination :total="100" />

    <br />
    <p>{{ telWidth }}</p>
    <ui-i18n></ui-i18n>

    <el-popover
      placement="top-start"
      title="Title"
      :width="200"
      trigger="hover"
      content="this is content, this is content, this is content"
    >
      <template #reference>
        <el-button class="m-2">Hover to activate</el-button>
      </template>
    </el-popover>

    <br />
    <br />
    <br />
    <br />

    <el-table mb-1 :data="[]" />
    <el-pagination :total="100" />

    <br />
    <p>{{ telWidth }}</p>
    <ui-i18n></ui-i18n>

    <el-popover
      placement="top-start"
      title="Title"
      :width="200"
      trigger="hover"
      content="this is content, this is content, this is content"
    >
      <template #reference>
        <el-button class="m-2">Hover to activate</el-button>
      </template>
    </el-popover>

    <br />

    <el-table mb-1 :data="[]" />
    <el-pagination :total="100" />

    <br />
    <p>{{ telWidth }}</p>
    <ui-i18n></ui-i18n>

    <el-popover
      placement="top-start"
      title="Title"
      :width="200"
      trigger="hover"
      content="this is content, this is content, this is content"
    >
      <template #reference>
        <el-button class="m-2">Hover to activate</el-button>
      </template>
    </el-popover>

    <br />

    <el-table mb-1 :data="[]" />
    <el-pagination :total="100" />

    <br />
    <p>{{ telWidth }}</p>
  </div>
</template>

<script setup>
// ElementPlus 的国际化配置
import { ref } from 'vue'

import UiI18n from '@/ui/desktop/components/UiI18n.vue'

const telWidth = ref(window.innerWidth)
</script>

<style></style>
