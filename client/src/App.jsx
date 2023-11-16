import socket from "./components/socket"
import { useEffect, useRef, useState } from "react";
import { initWebRtc, initWebRtcAnswer } from "./components/webrtc";

function App() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("")
  const [reciveMessage, setReciveMessage] = useState('')
  const [stream, setStream] = useState(null);
  const [sdp, setSdp] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null)
  const videoRef = useRef(null)

  // Helper Function
  const joinRoom = () => {
    if (room !== '') {
      socket.emit("join_room", room);
    } 
  };
  const sendMessage = () => {
    socket.emit("message", { message, room });
  };
  const getStream = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({video: true});
      setStream(s);
      return s;
    } catch (err) {
      console.log("Error Getting Stream: ", s);
    }
  };

  const callOrRecive = async () => {
    const peer = await initWebRtc({ stream, room });
    setPeerConnection(peer);
  }
  const joinMeet = async () => {
    const s = await getStream();
    console.log(s);
    const peer = await initWebRtcAnswer({stream: s, sdp, room});
    setPeerConnection(peer);
  }

  // UseEffects
  useEffect(() => {
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream; 
      }   
  }, [stream]);
  useEffect(() => {
    socket.on("recive_message", (data) => {
      setReciveMessage(data);
    })
    // Use Answer SPD function for this.
    socket.on("recive_sdp_offer", (data) => {
      setSdp(data);
    })
    socket.on("recive_sdp_answer", (data) => {
      console.log("Answer Recived from caller", data);
      
    })
  }, []);
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
      <div>
        <video ref={videoRef} autoPlay />
        <button onClick={getStream}>Get Stream</button>
      </div>


      <div>
        <button onClick={callOrRecive}>Call</button>
      </div>
      <div>
        <button onClick={joinMeet}>Join Meet</button>
      </div>
    </>
  )
}

export default App;
