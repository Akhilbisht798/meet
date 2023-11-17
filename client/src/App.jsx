import socket from "./components/socket"
import { useEffect, useRef, useState } from "react";
import { initWebRtc, initWebRtcAnswer } from "./components/webrtc";
import { onRecivingSDPOffer } from "./components/socketUtility";

function App() {
  const [room, setRoom] = useState("");
  const [stream, setStream] = useState(null);
  const [sdp, setSdp] = useState(null);
  const videoRef = useRef(null)

  // Helper Function
  const joinRoom = () => {
    if (room !== '') {
      socket.emit("join_room", room);
    } 
  };
  const getStream = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({video: true});
      setStream(s);
      return s;
    } catch (err) {
      console.log("Error Getting Stream: ", err);
    }
  };
  const callOrRecive = async () => {
    const s = await getStream();
    if (sdp !== null) {
      await initWebRtcAnswer({stream: s, sdp, room});
    } else {
      await initWebRtc({ stream: s, room });
    }
  }

  // UseEffects
  useEffect(() => {
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream; 
      }   
  }, [stream]);
  useEffect(() => {
    onRecivingSDPOffer(setSdp);
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
        <video ref={videoRef} autoPlay />
        <video id="remoteVideo" autoPlay />
      </div>
      <div>
        <button onClick={callOrRecive}>Start Call</button>
      </div>
      <div>
        <button onClick={callOrRecive}>Join</button>
      </div>
    </>
  )
}

export default App;
