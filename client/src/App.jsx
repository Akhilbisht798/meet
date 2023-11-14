import socket from "./components/socket"
import { useEffect, useState } from "react";

function App() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("")
  const [reciveMessage, setReciveMessage] = useState('')

  const joinRoom = () => {
    if (room !== '') {
      socket.emit("join_room", room);
    } 
  }
  const sendMessage = () => {
    socket.emit("message", { message, room });
  }
  useEffect(() => {
    socket.on("recive_message", (data) => {
      setReciveMessage(data)
    })
  })
  return (
    <>
      <h1>Meet</h1>
      <p>A online platform to meet and intract with others.</p>
      <div>
        <input placeholder="room" onChange={(e) => {setRoom(e.target.value)}}/>
        <button onClick={joinRoom}>Join Room</button>
      </div>
      <div>
        <input placeholder="Message" onChange={(e) => {setMessage(e.target.value)}}/>
        <button onClick={sendMessage}>Send Message</button>
      </div>
      <div>
        <h3>Recive Message: </h3>
        <h4>{reciveMessage}</h4>
      </div>
    </>
  )
}

export default App;