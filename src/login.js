const axios = require('axios')
const remote = require('electron').remote
const {ipcRenderer} = require('electron')

let loginUrl = 'https://i0iedy2914.execute-api.us-east-1.amazonaws.com/dev/login'

let loginWin = remote.getCurrentWindow()

const submitButton = document.getElementById('submit-btn')

submitButton.addEventListener('click', () => {
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  const body = { username, password }
  axios.post(loginUrl, body).then(res => {
    if (res.status === 200) {
      ipcRenderer.send('logged-in', res.data)
      alert('Login success!')
      loginWin.close()
    } else {
      alert('Invalid credentials!')
    }
  })
})

