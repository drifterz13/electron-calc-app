const {ipcRenderer} = require('electron')
const {dialog} = require('electron').remote
const fs = require('fs')
const axios = require('axios')

let a, b, operation, loadedData
let isCloudSave = false

const inputA = document.getElementById('a')
const inputB = document.getElementById('b')

let saveURL = 'https://i0iedy2914.execute-api.us-east-1.amazonaws.com/dev/data'
let loadURL = 'https://i0iedy2914.execute-api.us-east-1.amazonaws.com/dev/datas'
let loadByIdUrl = 'https://i0iedy2914.execute-api.us-east-1.amazonaws.com/dev/data/'

inputA.addEventListener('change', function() {
  a = +inputA.value
})

inputB.addEventListener('change', function() {
  b = +inputB.value
})


ipcRenderer.on('reset', () => reset())

ipcRenderer.on('logged-in', (event, arg) => {
  reset()
  document.getElementById('user').innerText = arg.username
})

ipcRenderer.on('log-out', () => {
  reset()
  document.getElementById('user').innerText = 'anonymous'
})

ipcRenderer.on('calc-data-id', (event, id) => {
  axios.get(loadByIdUrl + id).then(({data}) => {
    const { firstVariable, secondVariable } = data
    a = firstVariable
    b = secondVariable
    operation = data.operation
    result = data.result
    inputA.value = a
    inputB.value = b
    document.getElementById(operation).focus()
    document.getElementById('result').value = result
  })
})

document.getElementById('plus').addEventListener('click', function(event) {
  operation = event.target.id
  setResult(sum(a, b))
})

document.getElementById('minus').addEventListener('click', function() { 
  operation = event.target.id
  setResult(minus(a, b))
})

document.getElementById('multiple').addEventListener('click', function() { 
  operation = event.target.id
  setResult(multiple(a, b))
})

document.getElementById('divide').addEventListener('click', function() { 
  operation = event.target.id
  setResult(divide(a, b))
})

document.getElementById('pow').addEventListener('click', function() { 
  event.target.id
  setResult(pow(a, b))
})

document.getElementById('save').addEventListener('click', () => {
  try {
    const result = document.getElementById('result').value
    const content = JSON.stringify({ a, b, operation, result })
    if (isCloudSave) {
      const username = document.getElementById('user').innerText
      const saveContent = {
        firstVariable: a,
        secondVariable: b,
        operation,
        result,
        username
      }
      saveToCloud(JSON.stringify(saveContent))
      return
    }

    dialog.showSaveDialog((filename) => {
      if (filename === undefined) {
        alert('Please select the file!')
        return
      }

      fs.writeFile(filename, content, (err) => {
        if (err) {
          throw err
        }

        alert('Save file complete.')
      })
    })
  } catch (err) {
    alert('Something went wrong!')
  }
})

document.getElementById('load').addEventListener('click', () => {
  try {
    if (isCloudSave) {
      ipcRenderer.send('create-window-data')
      ipcRenderer.on('trigger-load-data', () => {
        loadFromCloud()
        // ipcRenderer.send('send-load-data', loadedData)
      })
      return
    }

    dialog.showOpenDialog((fileNames) => {
      if (fileNames === undefined) {
        alert('Please select the file!')
        return 
      }

      fs.readFile(fileNames[0], 'utf-8', (err, data) => {
        if (err) {
          throw err
        }

        setLoadFile(JSON.parse(data))
      })
    })
  } catch (err) {
    alert('Something went wrong!')
  }
})

document.getElementById('cloud-save').addEventListener('change', function() {
  isCloudSave = this.checked
})

const sum = (x, y) => x + y
const minus = (x, y) => x - y
const multiple = (x, y) => x * y
const divide = (x, y) => x / y
const pow = (x, y) => Math.pow(x, y)


function setResult(result) {
  document.getElementById('result').value = result
}

function reset() {
  document.getElementById('a').value = ''
  document.getElementById('b').value = ''
  document.getElementById('result').value = ''
  document.getElementById('cloud-save').checked = false
  document.getElementById('plus').blur()
  document.getElementById('minus').blur()
  document.getElementById('multiple').blur()
  document.getElementById('divide').blur()
  document.getElementById('pow').blur()
  document.getElementById('load').blur()
  document.getElementById('save').blur()
}

function setLoadFile(data) {
  const { operation, result } = data
  document.getElementById(operation).focus()
  a = +data.a
  b = +data.b
  inputA.value = a
  inputB.value = b
  document.getElementById('result').value = result
}

function loadFromCloud() {
  const user = document.getElementById('user').innerText
  axios.get(loadURL + `/${user}`).then(({data}) => {
    ipcRenderer.send('send-load-data', data)
  })
}

function saveToCloud(data) {
  axios.post(saveURL, data).then(({data}) => {
    alert('Save complete!')
  })
}