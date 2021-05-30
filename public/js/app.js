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
      msgInpt: document.getElementById('msg')
    }
  }

  const socket = VendorsCtrl.initSocketIo

  const { chatForm, chatMsgs, msgInpt } = getSelectors()

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

  const initEvtListeners = () => {
    msgSubmit()
  }

  const scrollToBottom = el => (el.scrollTop = el.scrollHeight)

  return {
    getSelectors,
    showMsg,
    initEvtListeners,
    scrollToBottom
  }
})()

const SocketCtrl = (() => {
  const socket = VendorsCtrl.initSocketIo

  const { showMsg, getSelectors, scrollToBottom } = UICtrl
  const { chatMsgs } = getSelectors()

  const urlParams = DataCtrl.getUrlParams()

  const listenToMsgFromServer = () => {
    socket.on('message', msg => {
      console.log(msg)
      showMsg(msg)

      // Scroll down
      scrollToBottom(chatMsgs)
    })
  }

  const joinChatRoom = () => {
    socket.emit('joinRoom', urlParams)
  }

  const init = () => {
    listenToMsgFromServer()
    joinChatRoom()
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
