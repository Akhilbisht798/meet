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

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("joined Room", data)
  })
  socket.on('message', (data) => {
    socket.to(data.room).emit("recive_message", data.message);
  });
  // Recive SDP FROM CALLER.
  // FORWARD TO ANSWER CLIENT.
  // ADD ROOM ALSO.
  socket.on("sdp_offer", (data) => {
    console.log("recived SDP", data);
    socket.to(data.room).emit("recive_sdp_offer", data);
  })
  // 

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

