const express = require('express');
const app = express();
const http = require('http'); 
const { Server } = require('socket.io')
const cors = require('cors')
require('dotenv').config()

const port = process.env.PORT | 80;
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: {
		origin: process.env.CLIENT_ORIGIN,
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
    socket.to(data.room).emit("recive_sdp_offer", data.sdp);
  })
  // Socket CLient will Send Answer
  // Send this answer to back to caller.
  socket.on("sdp_answer", (data) => {
    socket.to(data.room).emit("recive_sdp_answer", data.sdp);
  })

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
