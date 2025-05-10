# FFI Demo

这是一个使用 ffi-napi 的简单演示项目，展示了如何在 Electron 应用中调用 Windows API。

## 功能特点

- 使用 ffi-napi 调用 Windows API
- 演示了 MessageBoxW 函数的调用
- 包含完整的 Electron 应用结构
- 自动构建 Windows 可执行文件

## 开发环境要求

- Node.js 18.x
- Python 3.10
- Visual Studio 2022 Build Tools
- Windows SDK

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 运行应用：
```bash
npm start
```

3. 构建应用：
```bash
npm run build
```

## 自动构建

项目使用 GitHub Actions 自动构建 Windows 可执行文件。每次推送到 main 分支时都会触发构建。

构建产物可以在 GitHub Actions 的 Artifacts 中下载。 