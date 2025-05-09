# Electron FFI 测试项目

这是一个使用 Electron 和 ffi-napi 的简单测试项目。

## 环境要求

- Node.js 16 或更高版本
- npm 或 yarn

## 安装步骤

1. 克隆项目后，安装依赖：
```bash
npm install
```

2. 运行项目：
```bash
npm start
```

## 项目结构

- `main.js` - Electron 主进程文件
- `index.html` - 主页面
- `renderer.js` - 渲染进程文件，包含 FFI 测试代码
- `package.json` - 项目配置文件

## 功能说明

这个项目演示了如何在 Electron 应用中使用 ffi-napi 调用系统函数。当前示例中使用了 `printf` 函数作为演示。

## 注意事项

- 确保系统已安装必要的编译工具
- 在 Windows 系统上可能需要安装 Visual Studio Build Tools
- 在 macOS 上需要安装 Xcode Command Line Tools
