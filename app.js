const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Set static folder
app.use(express.static('public'))

const botName = 'ChatCord Bot'

// Run when client connects
io.on('connection', socket => {
  // Welcome current user
  socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!')) // emit to single client

  // Broadcast when a user connects
  socket.broadcast.emit(
    'message',
    formatMessage(botName, 'A user has joined the chat')
  ) // emit to all clients expect client thats connection

  // Runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', formatMessage(botName, 'A user has left the chat')) // emit to all clients
  })

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    io.emit('message', formatMessage('USER', msg))
  })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
