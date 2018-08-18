const {app, BrowserWindow, Menu, ipcMain} = require('electron')
require('electron-reload')('src')
  
  let win
  
  function createWindow () {
    win = new BrowserWindow({width: 800, height: 600})
    win.loadFile('src/index.html')
  
    win.webContents.openDevTools()
  
    win.on('closed', () => {
      win = null
    })

    var menu = Menu.buildFromTemplate([
      {
        label: 'Menu',
        submenu: [
          {label: 'Save File'},
          {label: 'Load File'},
          {
            label: 'Reset', click() {
              win.webContents.send('reset')
            }
          },

          {type: 'separator'},
          {
            label: 'Exit',
            click() {
              app.quit()
            }
          }
        ]
      }
    ])

    Menu.setApplicationMenu(menu);
  }
  
  app.on('ready', createWindow)
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    if (win === null) {
      createWindow()
    }
  })
  