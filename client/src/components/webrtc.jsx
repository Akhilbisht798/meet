import socket from './socket.js'

const config = [
   {
     urls: "stun:stun.l.google.com:19302",
   }
];

export async function initWebRtc({ stream, room }) {
	try {
		let offer; 
		const peerConnection = new RTCPeerConnection({ iceServers: config });
		await stream.getTracks().forEach( function(track) {
			peerConnection.addTrack(track, stream);
		});
		offer = peerConnection.createOffer()
		peerConnection.setLocalDescription(offer);
		peerConnection.onicegatheringstatechange = ev => {
			if (peerConnection.iceGatheringState === 'complete') {
				console.log("SDP COMPLETE: SEND SDP")
				const desc = peerConnection.localDescription
				socket.emit("sdp_offer", { sdp: desc, room});
			}
		};
		return peerConnection;
	}catch (err) {
		console.log("Error in Setting up peerConnection, ", err);
	}
}

export async function initWebRtcAnswer({ stream, sdp, room }) {
	try {
		console.log("Stream from INITWEBRTCANSWER: ", stream);
		const peerConnection = new RTCPeerConnection({ iceServers: config });
		await stream.getTracks().forEach( function(track) {
			peerConnection.addTrack(track, stream);
		});
		peerConnection.setRemoteDescription(sdp);
		const answer = await peerConnection.createAnswer()
		peerConnection.setLocalDescription(answer);
		peerConnection.onicegatheringstatechange = ev => {
			if (peerConnection.iceGatheringState === 'complete') {
				console.log("SDP COMPLETE: SEND ANSWER")
				const desc = peerConnection.localDescription
				socket.emit("sdp_answer", { sdp: desc, room });
			}
		};
		return peerConnection;
	} catch (err) {
		console.log("Error in setting up peerConnection ", err);
	}
}