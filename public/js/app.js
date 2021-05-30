const VendorsCtrl = (() => {
  const initSocketIo = () => io()

  const init = () => {
    initSocketIo()
  }
  return {
    initSocketIo,
    init
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

  const socket = VendorsCtrl.initSocketIo()

  const { chatForm, chatMsgs, msgInpt } = getSelectors()

  // Show message in DOM
  const showMsg = msg => {
    const body = /* html */ `
      <p class="meta">Brad <span>9:12pm</span></p>
      <p class="text">
        ${msg}
      </p>
    `

    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = body
    chatMsgs.appendChild(div)
  }

  const initEvtListeners = () => {
    // Message submit
    chatForm.addEventListener('submit', e => {
      e.preventDefault()

      // Get message text
      const msg = msgInpt.value

      // Emit message to server
      socket.emit('chatMessage', msg)
    })
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
  const socket = VendorsCtrl.initSocketIo()

  const { showMsg, getSelectors, scrollToBottom } = UICtrl
  const { chatMsgs } = getSelectors()

  const listenToMsgFromServer = () => {
    // Message from server
    socket.on('message', msg => {
      console.log('test')
      showMsg(msg)

      // Scroll down
      scrollToBottom(chatMsgs)
    })
  }

  const init = () => {
    return listenToMsgFromServer()
  }

  return {
    listenToMsgFromServer,
    init
  }
})()

const App = ((UICtrl, SocketCtrl) => {
  const init = () => {
    SocketCtrl.init()
    UICtrl.initEvtListeners()
  }

  return {
    init
  }
})(UICtrl, SocketCtrl)

App.init()
