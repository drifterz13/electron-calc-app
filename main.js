const {app, BrowserWindow, Menu, ipcMain} = require('electron')
require('electron-reload')('src')
  
  let win, win2, win3
  
  function createWindow () {
    win = new BrowserWindow({width: 800, height: 600})
    win.loadFile('src/index.html')
  
    // win.webContents.openDevTools()
  
    win.on('closed', () => {
      win = null
      win2 = null
    })

    ipcMain.on('logged-in', (event, arg) => {
      win.webContents.send('logged-in', arg)
    })

    ipcMain.on('create-window-data', () => {
      win3 = new BrowserWindow({ width: 600, height: 400 })
      win3.on('close', () => { win3 = null })
      win3.loadFile('src/data.html')
      win3.show()
      // win3.webContents.openDevTools()
    })

    ipcMain.on('win3-finish-load', () => {
      win.webContents.send('trigger-load-data')
    })

    ipcMain.on('send-load-data', (_, arg) => {
      win3.webContents.send('data', arg)
    })

    ipcMain.on('data-id', (event, arg) => {
      win.webContents.send('calc-data-id', arg)
    })

    var menu = Menu.buildFromTemplate([
      {
        label: 'Menu',
        submenu: [
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
      },
      {
        label: 'User',
        submenu: [
          {
            label: 'Login', click() {
              win2 = new BrowserWindow({ width: 400, height: 400 })
              win2.on('close', () => { win2 = null })
              win2.loadFile('src/login.html')
              win2.show()
              // win2.webContents.openDevTools()
            }
          },
          { 
            label: 'Logout', click() {
              win.webContents.send('log-out')
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
  