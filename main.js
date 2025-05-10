const { app, BrowserWindow } = require('electron')
const path = require('path')

// 设置原生模块的搜索路径
if (app.isPackaged) {
  process.env.NODE_PATH = path.join(process.resourcesPath, 'node_modules')
  require('module').Module._initPaths()
}

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  win.loadFile('index.html')
  
  // 开发环境下打开开发者工具
  if (!app.isPackaged) {
    win.webContents.openDevTools()
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
}) 