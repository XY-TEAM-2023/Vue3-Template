# 2. VSCode开发环境

## 2.1 安装插件

- [Vue Language Features (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (需要禁用Vetur)
- [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)（快速跳转到导入的组件、变量、样式等定义处）
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)（代码格式化工具）
- [vscode-icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons)（优化图标）
- [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)（文件路径提示）

## 2.2 VSCode添加 crlt + s  自动格式化

- 新增`.prettierrc`配置文件，需要对哪些内容进行格式化

  ```json
  {
    "tabWidth": 2,
    "printWidth": 80,
    "singleQuote": true,
    "trailingComma": "es5",
    "semi": false,
    "jsxSingleQuote": false,
    "jsxBracketSameLine": false,
    "arrowParens": "always"
  }
  ```

- 新增`.prettierignore ` 忽略格式的文件

  ```
  /dist/*
  .local
  .output.js
  /node_modules/**
  
  **/*.svg
  **/*.sh
  
  /public/*
  ```

- 根目录创建 .vscode/settings.json 文件

  ```json
  {
    "editor.formatOnSave": true,
    "[javascript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[html]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[css]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[vue]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
  }
  ```

- 左下角点击设置——settings——右上角打开settings.js——添加或替换以下内容

  ```json
    "[javascript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[javascriptreact]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
  ```