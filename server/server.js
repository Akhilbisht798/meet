const express = require('express');
const app = express();
const http = require('http'); 
const { Server } = require('socket.io')
const cors = require('cors')

const port = 3000
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ['GET', 'POST'],
	}
})

app.get('/', (req, res) => {
  res.send('Hello, Express with Socket.IO!');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (message) => {
    console.log("FROM CLIENT: ", message)
    io.emit('message from server', message); 
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

