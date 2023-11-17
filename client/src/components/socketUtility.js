import socket from "./socket";

export const joinRoom = (room) => {
    if (room !== '') {
      socket.emit("join_room", room);
    } 
}

export const sendMessage = ({ message, room }) => {
	socket.emit("message", { message, room });
};

export const onReciveMessage = (callback) => {
    socket.on("recive_message", (data) => {
      callback(data);
    })
} 

export const onRecivingSDPOffer = (callback) => {
    socket.on("recive_sdp_offer", (data) => {
      callback(data);
    })
}

export const onReciveSDPAnswer = ({ peerConnection }) => {
	socket.on("recive_sdp_answer", (data) => {
		peerConnection.setRemoteDescription(data);
		console.log("connection established.")
	})
}

