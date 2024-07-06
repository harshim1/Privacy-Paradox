const express = require('express');
const http = require('http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User'); // Adjust the path as necessary
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://shreyasa:rAxoQymiL4id41tD@cluster1.bm4u1wu.mongodb.net/ChatDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const messages = []; // In-memory message storage; replace with DB logic in production

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', ({ sender, receiver, message }) => {
    const chatMessage = { sender, receiver, message, timestamp: new Date() };
    messages.push(chatMessage); // Save the message in-memory; replace with DB logic

    io.emit('receiveMessage', chatMessage); // Emit the message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
