const {ipcRenderer} = require('electron')
const {dialog} = require('electron').remote
const fs = require('fs')

let operation;
let a, b;

const inputA = document.getElementById('a')
const inputB = document.getElementById('b')

inputA.addEventListener('change', function() {
  a = +inputA.value
})

inputB.addEventListener('change', function() {
  b = +inputB.value
})


ipcRenderer.on('reset', (event, arg) => {
  if (arg === 'RESET') {
    reset()
  }
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

function sum(x, y) {
  return x + y
}

function minus(x, y) {
  return x - y
}

function multiple(x, y) {
  return x * y
}

function divide(x, y) {
  return x/y
}

function pow(x, y) {
  return Math.pow(x, y)
}

function setResult(result) {
  document.getElementById('result').value = result
}

function reset() {
  document.getElementById('a').value = ''
  document.getElementById('b').value = ''
  document.getElementById('result').value = ''
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