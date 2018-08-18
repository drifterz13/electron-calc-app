const {ipcRenderer, remote} = require('electron')

let dataWin = remote.getCurrentWindow()

window.onload = () => {
  ipcRenderer.send('win3-finish-load')
}

ipcRenderer.on('data', (event, data) => {
  const parent = document.getElementById('data-container')
  const child = document.getElementsByClassName('list-group')[0]
  if (child) {
    parent.removeChild(child)
  }
  createUi(data.calcData)
})

function createUi(datas) {
  const list = document.createElement('div')
  list.setAttribute('class', 'list-group')
  datas.forEach(el => {
    let link = document.createElement('a')
    link.setAttribute('class', 'list-group-item list-group-item-action')
    link.setAttribute('style', 'cursor: pointer; display: block')
    link.addEventListener('click', e => getDataId(e))
    link.appendChild(document.createTextNode(el._id))
    list.appendChild(link)
  })
  document.getElementById('data-container').appendChild(list)
}

function getDataId(event) {
  const dataId = event.target.innerText
  ipcRenderer.send('data-id', dataId)
  dataWin.close()
}