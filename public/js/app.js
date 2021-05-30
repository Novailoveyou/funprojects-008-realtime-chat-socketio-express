const VendorsCtrl = (() => {
  const initSocketIo = io()

  return {
    initSocketIo
  }
})()

const DataCtrl = (() => {
  const getUrlParams = () => {
    const urlParams = Qs.parse(location.search, {
      ignoreQueryPrefix: true
    })

    return urlParams
  }

  return {
    getUrlParams
  }
})()

const UICtrl = (() => {
  // UI Selectors
  const getSelectors = () => {
    return {
      chatForm: document.getElementById('chat-form'),
      chatMsgs: document.querySelector('.chat-messages'),
      msgInpt: document.getElementById('msg'),
      roomName: document.getElementById('room-name'),
      userList: document.getElementById('users')
    }
  }

  const socket = VendorsCtrl.initSocketIo

  const { chatForm, chatMsgs, msgInpt, roomName, userList } = getSelectors()

  // Show message in DOM
  const showMsg = ({ username, time, text }) => {
    const body = /* html */ `
      <p class="meta">${username} <span>${time}</span></p>
      <p class="text">
        ${text}
      </p>
    `

    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = body
    chatMsgs.appendChild(div)
  }

  const msgSubmit = () => {
    chatForm.addEventListener('submit', e => {
      e.preventDefault()

      // Get message text
      const msg = msgInpt.value

      // Emit message to server
      socket.emit('chatMessage', msg)

      // Clear input
      msgInpt.value = ''
      msgInpt.focus()
    })
  }

  const showRoomName = room => {
    roomName.innerText = room
  }

  const showUserNames = users => {
    userList.innerHTML = /* html */ `
      ${users.map(user => /* html */ `<li>${user.username}</li>`).join('')}
    `
  }

  const initEvtListeners = () => {
    msgSubmit()
  }

  const scrollToBottom = el => (el.scrollTop = el.scrollHeight)

  return {
    getSelectors,
    showMsg,
    initEvtListeners,
    scrollToBottom,
    showRoomName,
    showUserNames
  }
})()

const SocketCtrl = (() => {
  const socket = VendorsCtrl.initSocketIo

  const { showMsg, getSelectors, scrollToBottom, showRoomName, showUserNames } =
    UICtrl
  const { chatMsgs } = getSelectors()

  const urlParams = DataCtrl.getUrlParams()

  const listenToMsgFromServer = () => {
    socket.on('message', msg => {
      showMsg(msg)

      // Scroll down
      scrollToBottom(chatMsgs)
    })
  }

  const joinChatRoom = () => {
    socket.emit('joinRoom', urlParams)
  }

  const getRoomAndUsers = () => {
    socket.on('roomUsers', ({ room, users }) => {
      showRoomName(room)
      showUserNames(users)
    })
  }

  const init = () => {
    listenToMsgFromServer()
    joinChatRoom()
    getRoomAndUsers()
  }

  return {
    listenToMsgFromServer,
    init
  }
})()

const App = ((VendorsCtrl, UICtrl, SocketCtrl) => {
  const init = () => {
    SocketCtrl.init()
    UICtrl.initEvtListeners()
  }

  return {
    init
  }
})(VendorsCtrl, UICtrl, SocketCtrl)

App.init()
