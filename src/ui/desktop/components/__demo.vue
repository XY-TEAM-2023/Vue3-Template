<!--调用案例-->
<!--<template>-->
<!--  <custom-component title="示例标题" :value="componentValue" @update:value="componentValue = $event" @custom-event="handleCustomEvent">-->
<!--    <template v-slot:additional-content>-->
<!--      <p>这是额外的插槽内容。{{ componentValue }}</p>-->
<!--    </template>-->
<!--  </custom-component>-->
<!--  <el-input v-model="componentValue"></el-input>-->
<!--</template>-->

<!--<script>-->
<!--import CustomComponent from '@/components/common/__demo.vue'-->

<!--export default {-->
<!--  components: {-->
<!--    CustomComponent,-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      componentValue: '初始值',-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    handleCustomEvent(eventData) {-->
<!--      console.log('收到自定义事件:', eventData)-->
<!--    },-->
<!--  },-->
<!--}-->
<!--</script>-->

<template>
  <div>
    <!-- 使用计算属性来显示标题 -->
    <h3>{{ computedTitle }}</h3>

    <!-- 数据双向绑定的输入框 -->
    <input v-model="inputValue" @input="onInput" />

    <!-- 按钮用于触发方法 -->
    <button @click="emitCustomEvent">触发自定义事件</button>

    <!-- 插槽用于从父组件插入内容 -->
    <slot name="additional-content"></slot>
  </div>
</template>

<script>
export default {
  name: 'CustomComponent',

  // props: 定义组件接收的外部属性
  props: {
    title: {
      type: String, // String、Number、Boolean、Object、Array、Function、Date
      required: true, // 标题是必需的
    },
    value: {
      type: String,
      default: '', // 可选的值，默认为空字符串
    },
  },

  // data: 组件的响应式数据
  data() {
    return {
      inputValue: this.value, // 初始化 inputValue 为传入的 value 值
    }
  },

  // computed: 计算属性
  computed: {
    computedTitle() {
      return '计算后的标题: ' + this.title // 根据传入的 title 计算新值
    },
  },

  // watch: 观察 props 的变化
  watch: {
    // 输入值value变化, 同步内部变化
    value: {
      immediate: true, // 立即执行一次
      handler(newValue) {
        this.inputValue = newValue // 更新 inputValue 当 value 改变
      },
    },
  },

  // methods: 组件的方法
  methods: {
    // 触发数据变化事件，让父对象同步数据
    onInput(event) {
      this.inputValue = event.target.value
      this.$emit('update:value', this.inputValue) // 触发 update:value 事件用于 v-model 双向绑定
    },
    // 触发自定义事件
    emitCustomEvent() {
      this.$emit('custom-event', { msg: '这是自定义事件的数据' }) // 触发一个自定义事件
    },
  },

  // 生命周期钩子
  created() {
    console.log('组件已创建')
  },
  mounted() {
    console.log('组件已挂载')
  },
  updated() {
    console.log('组件已更新')
  },
  beforeUnmount() {
    // Vue 3 生命周期钩子 beforeDestroy -> beforeUnmount
    console.log('组件销毁之前')
  },
}
</script>

<style scoped>
/* 组件样式 */
</style>
