import socket from './socket.js'

const config = [
   {
     urls: "stun:stun.l.google.com:19302",
   }
];

export async function initWebRtc({ stream }) {
	try {
		let offer; 
		const peerConnection = new RTCPeerConnection({ iceServers: config });
		await stream.getTracks().forEach( function(track) {
			peerConnection.addTrack(track, stream);
		});
		// Check for answer or caller
		// if (sdp !== null) {
		// 	peerConnection.setRemoteDescription(sdp);
		// 	offer = peerConnection.createAnswer();
		// 	peerConnection.setLocalDescription(offer)
		// } else {
		// }

		offer = peerConnection.createOffer()
		peerConnection.setLocalDescription(offer);
		peerConnection.onicegatheringstatechange = ev => {
			if (peerConnection.iceGatheringState === 'complete') {
				console.log("SDP COMPLETE: SEND SDP")
				const desc = peerConnection.localDescription
				socket.emit("sdp_offer", { sdp: desc });
			}
		};
		return {
			peerConnection,
			offer,
		};
	}catch (err) {
		console.log("Error in Setting up peerConnection, ", err);
	}
}