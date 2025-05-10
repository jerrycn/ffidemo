const { app, BrowserWindow } = require('electron');
const path = require('path');
const ffi = require('ffi-napi');
const ref = require('ref-napi');

// 创建一个简单的 DLL 函数调用示例
const user32 = new ffi.Library('user32', {
  'MessageBoxW': ['int', ['int', 'string', 'string', 'int']]
});

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // 加载 index.html
  win.loadFile('src/index.html');

  // 显示一个消息框
  user32.MessageBoxW(0, 'Hello from FFI!', 'FFI Demo', 0);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); 