import socket from "./components/socket"

function App() {

  const sendMessage = () => {
    socket.emit("message", { message: "Hello"});
  }
  return (
    <>
      <h1>Meet</h1>
      <p>A online platform to meet and intract with others.</p>
      <div>
        <input placeholder="Message" />
        <button onClick={sendMessage}>Send Message</button>
      </div>
    </>
  )
}

export default App
