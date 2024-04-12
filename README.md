# 项目运行
## 初始化依赖

```sh
npm install
```

## 调试运行

```sh
npm run dev
```

## 编译项目

```sh
npm run build
```

# 右键菜单
1. 在可以右键的组件上添加指令 `v-menu`, 值为菜单定义
    ```vue
    <template>
        <el-button v-menu="menuItems">
            可以右键的按钮
        </el-button>
    </template>
    
    <script setup>
    const menuItems =  reactive([
      {
        // 菜单标题 
        text: '选项1',
        // 使用Element图标
        icon: 'Finished',
        // 获得焦点颜色, 可空
        hoverColor: '#FF0000',
        // 是否显示
        display: 'true',
        // 是否禁用
        disabled: 'false',
        // 点击事件
        action: () => console.log('选项1被点击')  
      },
      {
        // 菜单国际化
        text: 'demoView.menuTitle', 
        // 图标使用自定义svg
        icon: `<svg t="1703992207510" class="icon" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2478" width="32" height="32"><path d="M347.64 546.3l103.28 357.77 498.07-720zM334.72 523.93l614.27-339.86-872.55 71.61z" fill="#040000" p-id="2479"></path></svg>`,
        // 点击事件
        action: () => console.log('选项2被点击'), // 点击事件
      },
    ])
    </script>
    ```
2. v-for中在菜单点击事件中得到当前右键对象的数据
    ```vue
    <template>
        <div v-for='item in tableData' :key='item' v-menu="menuItems(item)">
            {{ item }}
        </div>
    </template>
    
    <script setup>
    const tableData = reactive(['a', 'b', 'c'])
      
    const menuItems = (item) => (reactive([
      {
        text: '选项1',
        icon: 'Finished',
        action: () => console.log('选项1被点击, item: ' + item)  
      },
      ...
    ]))
    </script>
    ```
   
3. 通过js调用右键菜单
   ```vue
   import { showContextMenu } from '@/ui/components/Menu/v-menu'
   
   showContextMenu(e, menuItems)
   ```