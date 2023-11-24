import socket from './socket.js'

const config = [
   {
     urls: "stun:stun.l.google.com:19302",
   }
];

export async function initWebRtc({ stream, room }) {
	try {
		const peerConnection = new RTCPeerConnection({ iceServers: config });
		await stream.getTracks().forEach( function(track) {
			peerConnection.addTrack(track, stream);
		});
		peerConnection.ontrack = e => {
			const stream = e.streams[0];
			const videoElement = document.getElementById('remoteVideo');
			videoElement.srcObject = stream;
			
		}
		const offer = peerConnection.createOffer()
		peerConnection.setLocalDescription(offer);
		peerConnection.onicegatheringstatechange = ev => {
			if (peerConnection.iceGatheringState === 'complete') {
				const desc = peerConnection.localDescription
				socket.emit("sdp_offer", { sdp: desc, room});
			}
		};
		peerConnection.onsignalingstatechange = e => {
			console.log("State: ", peerConnection.iceConnectionState)
			if (peerConnection.iceConnectionState === 'disconnected') {
				console.log("client disconnected")
			}
		}
		socket.on("recive_sdp_answer", (data) => {
			peerConnection.setRemoteDescription(data);
			console.log("connection established.")
		})
		return peerConnection;
	}catch (err) {
		console.log("Error in Setting up peerConnection, ", err);
	}
}

export async function initWebRtcAnswer({ stream, sdp, room }) {
	try {
		const peerConnection = new RTCPeerConnection({ iceServers: config });
		peerConnection.ontrack = e => {
			const stream = e.streams[0];
			const videoElement = document.getElementById('remoteVideo');
			videoElement.srcObject = stream;
		}
		await stream.getTracks().forEach( function(track) {
			peerConnection.addTrack(track, stream);
		});
		console.log("Sdp recived from caller", sdp)
		peerConnection.setRemoteDescription(sdp);
		const answer = await peerConnection.createAnswer()
		peerConnection.setLocalDescription(answer);
		peerConnection.onicegatheringstatechange = ev => {
			if (peerConnection.iceGatheringState === 'complete') {
				const desc = peerConnection.localDescription
				socket.emit("sdp_answer", { sdp: desc, room });
			}
		};
		peerConnection.onsignalingstatechange = e => {
			console.log("State: ", peerConnection.iceConnectionState)
			if (peerConnection.iceConnectionState === 'disconnected') {
				console.log("client disconnected")
			}
		}
		return peerConnection;
	} catch (err) {
		console.log("Error in setting up peerConnection ", err);
	} 
	
}
